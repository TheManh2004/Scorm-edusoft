import { updateSidebarAfterUnlock } from './sidebar.js';
let player;
let startTime = 0;
let watchInterval;
let totalWatchTime = 0;

export function loadLessonContent(
  lesson,
  videoFrameId,
  descriptionId,
  materialListId,
  loadingIndicatorId
) {
  const videoFrame = document.getElementById(videoFrameId);
  const loadingIndicator = document.getElementById(loadingIndicatorId);

  loadingIndicator.style.display = "block";
  videoFrame.style.display = "none";

  videoFrame.src = lesson.video.url;
  document.getElementById(descriptionId).innerHTML = lesson.video.description;

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
    startTime = Date.now();
    watchInterval = setInterval(checkWatchTime, 1000);
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    clearInterval(watchInterval);
    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      totalWatchTime += elapsed;
      startTime = 0;
    }
  }
}
function updateLessonStatus(courseId, lessonId, status) {
  const lessonStatus = JSON.parse(localStorage.getItem("lessonStatus") || "{}");

  const lessonKey = `${courseId}-${lessonId}`;

  lessonStatus[lessonKey] = status;

  // // Lưu lại trạng thái mới vào localStorage
  // localStorage.setItem("lessonStatus", JSON.stringify(lessonStatus));
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
  const currentLessonKey = localStorage.getItem("selectedLessonKey");
  if (!currentLessonKey) return;

  const [courseId, lessonId] = currentLessonKey.split("-").map(Number);

  fetchCourses().then((courses) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const lessons = course.lessons;
    const lastLessonId = lessons[lessons.length - 1].id;

    let nextLessonKey;
    let nextLessonId;
    if (lessonId === lastLessonId) {
      const nextCourse = courses.find((c) => c.id === courseId + 1);
      if (nextCourse) {
        nextLessonId = 1;
        nextLessonKey = `${nextCourse.id}-1`;
      }
    } else {
      nextLessonId = lessonId + 1;
      nextLessonKey = `${courseId}-${nextLessonId}`;
    }

    if (!nextLessonKey) return;

    const unlockedLessons = JSON.parse(
      localStorage.getItem("unlockedLessons") || "[]"
    );
    if (!unlockedLessons.includes(nextLessonKey)) {
      unlockedLessons.push(nextLessonKey);
      localStorage.setItem("unlockedLessons", JSON.stringify(unlockedLessons));
      showNotification("Bài học tiếp theo đã được mở!");

      updateLessonStatus(courseId, nextLessonId, true);

      
      updateSidebarAfterUnlock(nextLessonKey, courseId);
    }
  });
}

function fetchCourses() {
  return fetch("./data/json/course.json")
    .then((response) => response.json())
    .then((data) => data.courses);
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
