export function initializeSidebar(data, courseListId, lessonCallback) {
  if (!localStorage.getItem("unlockedLessons")) {
    localStorage.setItem("unlockedLessons", JSON.stringify(["1-1"])); 
  }

  const courseList = document.getElementById(courseListId);
  const selectedLessonKey = localStorage.getItem("selectedLessonKey");
  const unlockedLessons = JSON.parse(
    localStorage.getItem("unlockedLessons") || "[]"
  );

  courseList.innerHTML = "";

  data.courses.forEach((course) => {
    const courseItem = document.createElement("li");
    courseItem.dataset.courseId = course.id;

    const arrow = document.createElement("span");
    arrow.textContent = "▶";
    arrow.style.cursor = "pointer";
    arrow.style.marginLeft = "10px";

    const courseTitle = document.createElement("span");
    courseTitle.textContent = course.title;
    courseTitle.style.fontWeight = "bold";
    courseTitle.style.marginLeft = "10px";

    const lessonCount = document.createElement("span");
    lessonCount.textContent = `(${course.lessons.length} bài học)`;
    lessonCount.style.fontSize = "12px";
    lessonCount.style.color = "#666";
    lessonCount.style.marginLeft = "10px";

    courseItem.appendChild(arrow);
    courseItem.appendChild(courseTitle);
    courseItem.appendChild(lessonCount);

    const lessonList = document.createElement("ul");
    lessonList.style.height = "0";
    lessonList.style.transition = "height 0.3s ease-out, padding 0.3s ease-out";
    lessonList.style.overflow = "hidden";

    course.lessons.forEach((lesson) => {
      const lessonItem = document.createElement("li");
      lessonItem.textContent = lesson.title;
      lessonItem.dataset.lessonId = lesson.id;

      const lockIcon = document.createElement("i");
        lockIcon.className = "fa fa-lock"; 
        lockIcon.style.marginLeft = "5px";
        lockIcon.style.color = "#b3b3b3"; 


      const lessonKey = `${course.id}-${lesson.id}`;

      if (unlockedLessons.includes(lessonKey)) {
        lessonItem.style.pointerEvents = "auto";
        lessonItem.style.color = "#000";
      } else {
        lessonItem.style.pointerEvents = "none";
        lessonItem.style.color = "#6e6e6e";
        lessonItem.appendChild(lockIcon); 
      }

      if (selectedLessonKey === lessonKey) {
        lessonItem.classList.add("active");
        lessonCallback(lesson);

        lessonList.style.height = "auto";
        lessonList.style.overflow = "visible";
        lessonList.style.padding = "5px";
        arrow.textContent = "▼";
      }

      lessonItem.addEventListener("click", (event) => {
        event.stopPropagation();

        localStorage.setItem("selectedLessonKey", lessonKey);

        document
          .querySelectorAll(`#${courseListId} li ul li`)
          .forEach((item) => {
            item.classList.remove("active");
          });

        lessonItem.classList.add("active");
        lessonCallback(lesson);
      });

      lessonList.appendChild(lessonItem);
    });

    const toggleLessonList = () => {
      const isExpanded = lessonList.style.height === "auto";

      if (isExpanded) {
        lessonList.style.height = "0";
        lessonList.style.overflow = "hidden";
        lessonList.style.padding = "0";
        arrow.textContent = "▶";
      } else {
        lessonList.style.height = "auto";
        lessonList.style.overflow = "visible";
        lessonList.style.padding = "5px";
        arrow.textContent = "▼";
      }
    };

    courseItem.addEventListener("click", toggleLessonList);
    arrow.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLessonList();
    });

    courseItem.appendChild(lessonList);
    courseList.appendChild(courseItem);
  });
}

export function updateSidebarAfterUnlock(nextLessonKey, courseId) {
  const courseListId = "course-list";
  const courseList = document.getElementById(courseListId);

  const courseItems = courseList.querySelectorAll("li");
  courseItems.forEach((courseItem) => {
    const lessons = courseItem.querySelectorAll("ul li");
    lessons.forEach((lessonItem) => {
      const lessonKey =
        courseItem.dataset.courseId + "-" + lessonItem.dataset.lessonId;
      if (lessonKey === nextLessonKey) {
        lessonItem.style.pointerEvents = "auto";
        lessonItem.style.color = "#000";

        const lockIcon = lessonItem.querySelector("i");
        if (lockIcon) lockIcon.remove(); 
      }
    });
  });
}
