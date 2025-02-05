export function initializeSidebar(sessions, courseListId, lessonCallback) {
  if (!localStorage.getItem("unlockedLessons")) {
      localStorage.setItem("unlockedLessons", JSON.stringify(["1-1-1"])); 
  }

  const courseList = document.getElementById(courseListId);
  const unlockedLessons = JSON.parse(localStorage.getItem("unlockedLessons") || "[]");

  courseList.innerHTML = "";

  sessions.forEach((session) => {
      const sessionItem = document.createElement("li");
      sessionItem.textContent = session.title;
      sessionItem.style.fontWeight = "bold";
      sessionItem.style.marginTop = "10px";

      const topicList = document.createElement("ul");
      topicList.style.marginLeft = "15px";

      session.topics.forEach((topic) => {
          const topicItem = document.createElement("li");
          topicItem.textContent = topic.title;

          const lessonList = document.createElement("ul");
          lessonList.style.marginLeft = "15px";

          topic.lessons.forEach((lesson) => {
              const lessonItem = document.createElement("li");
              lessonItem.textContent = lesson.title;
              lessonItem.dataset.lessonKey = `${session.id}-${topic.id}-${lesson.id}`;

              if (unlockedLessons.includes(lessonItem.dataset.lessonKey)) {
                  lessonItem.style.pointerEvents = "auto";
                  lessonItem.style.color = "#000";
              } else {
                  lessonItem.style.pointerEvents = "none";
                  lessonItem.style.color = "#6e6e6e";
                  const lockIcon = document.createElement("i");
                  lockIcon.className = "fa fa-lock";
                  lockIcon.style.marginLeft = "5px";
                  lockIcon.style.color = "#b3b3b3";
                  lessonItem.appendChild(lockIcon);
              }

              lessonItem.addEventListener("click", () => {
                  localStorage.setItem("selectedLessonKey", lessonItem.dataset.lessonKey);
                  lessonCallback(lesson);
              });

              lessonList.appendChild(lessonItem);
          });

          topicItem.appendChild(lessonList);
          topicList.appendChild(topicItem);
      });

      sessionItem.appendChild(topicList);
      courseList.appendChild(sessionItem);
  });
}

export function updateSidebarAfterUnlock(nextLessonKey) {
  const unlockedLessons = JSON.parse(localStorage.getItem("unlockedLessons") || "[]");
  if (!unlockedLessons.includes(nextLessonKey)) {
      unlockedLessons.push(nextLessonKey);
      localStorage.setItem("unlockedLessons", JSON.stringify(unlockedLessons));
  }

  const lessonItem = document.querySelector(`[data-lesson-key="${nextLessonKey}"]`);
  if (lessonItem) {
      lessonItem.style.pointerEvents = "auto";
      lessonItem.style.color = "#000";
      const lockIcon = lessonItem.querySelector("i");
      if (lockIcon) lockIcon.remove(); 
  }
}
