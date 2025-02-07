import { updateSidebarAfterUnlock } from './sidebar.js';
let player;
let startTime = 0;
let watchInterval;
let totalWatchTime = 0;

export function loadLessonContent(lesson, videoFrameId, descriptionId, materialListId,contentListId, loadingIndicatorId) {
    
    const videoFrame = document.getElementById(videoFrameId);
    const loadingIndicator = document.getElementById(loadingIndicatorId);

    loadingIndicator.style.display = "block";
    videoFrame.style.display = "none";

    videoFrame.src = lesson.video.url;
    document.getElementById(descriptionId).innerHTML = lesson.video.description;

    const contentList = document.getElementById(contentListId);
    contentList.innerHTML = "";

    lesson.lessonContent.forEach((content) => {
        const contentItem = document.createElement("li");
        contentItem.innerHTML = `<p>${content.content}</p>`;
        contentList.appendChild(contentItem);
    });

    const materialList = document.getElementById(materialListId);
    materialList.innerHTML = "";

    lesson.materials.forEach((material) => {
        const materialItem = document.createElement("li");
        materialItem.innerHTML = `<a href="${material.url}" target="_blank">${material.name}</a>`;
        materialList.appendChild(materialItem);
    });

    videoFrame.onload = () => {
        loadingIndicator.style.display = "none";
        videoFrame.style.display = "block";
        initYouTubePlayer(lesson.video.url);
    };
}

function initYouTubePlayer(videoUrl) {
    const videoId = extractVideoId(videoUrl);

    player = new YT.Player("video-frame", {
        height: "360",
        width: "640",
        videoId: videoId,
        events: {
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
    //   clearInterval(watchInterval);
        startTime = Date.now();
        watchInterval = setInterval(checkWatchTime, 1000);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        clearInterval(watchInterval);
        if (startTime) {
            const elapsed = (Date.now() - startTime) / 1000;
            totalWatchTime += elapsed;
            startTime = 0;
        }
    }
}

function checkWatchTime() {
    const elapsed = (Date.now() - startTime) / 1000 + totalWatchTime;
    if (elapsed >= 30) {
        totalWatchTime = 0;
        clearInterval(watchInterval);
        unlockNextLesson();
    }
}

function unlockNextLesson() {
  try {
      const currentLessonKey = localStorage.getItem("selectedLessonKey");
      if (!currentLessonKey) return;

      const keys = currentLessonKey.split("-");
      let sessionId = Number(keys[0]);
      let topicId = Number(keys[1]);
      let lessonId = Number(keys[2]);

      fetch('../json/course.json')
          .then(response => response.json())
          .then(data => {
              try {
                  const session = data.sessions.find(s => s.id === sessionId);
                  if (!session) return;

                  const topic = session.topics.find(t => t.id === topicId);
                  if (!topic) return;

                  const isLastLessonInTopic = lessonId === topic.lessons.length;
                  const isLastTopicInSession = topicId === session.topics.length;
                  const isLastSession = sessionId === data.sessions.length;

                  let nextLessonKey;

                  if (!isLastLessonInTopic) {
                      nextLessonKey = `${sessionId}-${topicId}-${lessonId + 1}`;
                  } else if (!isLastTopicInSession) {
                      nextLessonKey = `${sessionId}-${topicId + 1}-1`;
                  } else if (!isLastSession) {
                      nextLessonKey = `${sessionId + 1}-1-1`;
                  } else {
                      showNotification("Bạn đã hoàn thành toàn bộ khóa học. Chúc mừng!");
                      totalWatchTime = 0;
                      return;
                  }

                  if (nextLessonKey) {
                      updateSidebarAfterUnlock(nextLessonKey);
                      showNotification("Bài học tiếp theo đã được mở!");
                      totalWatchTime = 0;
                  }
              } catch (error) {
                  console.error("Error unlocking next lesson:", error);
              }
          })
          .catch(error => {
              console.error("Error fetching course data:", error);
          });
  } catch (error) {
      console.error("Error unlocking next lesson:", error);
  }
}


function showNotification(message) {
    const notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "#4CAF50";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "1000";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.display = "none";
        document.body.removeChild(notification);
    }, 3000);
}

function extractVideoId(url) {
    const urlParams = new URL(url).searchParams;
    return urlParams.get("v") || url.split("/").pop().split("?")[0];
}
