export function initializeSidebar(sessions, courseListId, lessonCallback) {
  if (!localStorage.getItem("unlockedLessons") || JSON.parse(localStorage.getItem("unlockedLessons")).length === 0) {
    localStorage.setItem("unlockedLessons", JSON.stringify(["1-1-1"]));
}
  
    const courseList = document.getElementById(courseListId);
    const unlockedLessons = JSON.parse(localStorage.getItem("unlockedLessons") || "[]");
    courseList.innerHTML = "";
  
    let totalLessons = 0;
    let unlockedCount = unlockedLessons.length;
  
    sessions.forEach((session) => {
      session.topics.forEach((topic) => {
        totalLessons += topic.lessons.length;
      });
    });
  
    updateProgress(unlockedCount, totalLessons);
  
    sessions.forEach((session) => {
      const sessionItem = document.createElement("li");
      sessionItem.style.marginTop = "10px";
  
      const sessionHeader = document.createElement("div");
      sessionHeader.textContent = session.title;
      sessionHeader.style.fontWeight = "bold";
      sessionHeader.style.cursor = "pointer";
  
      const sessionArrow = document.createElement("span");
      sessionArrow.textContent = " ▶ ";
      sessionArrow.style.marginRight = "5px";
  
      sessionHeader.prepend(sessionArrow);
  
      const topicList = document.createElement("ul");
      topicList.style.marginLeft = "15px";
      topicList.style.overflow = "hidden";
      topicList.style.transition = "max-height 0.3s ease-out, padding 0.3s ease-out";
      topicList.style.maxHeight = "0px";
  
      sessionHeader.addEventListener("click", () => {
        toggleDropdown(topicList, sessionArrow);
      });
  
      session.topics.forEach((topic) => {
        const topicItem = document.createElement("li");
        topicItem.style.marginTop = "5px";
  
        const topicHeader = document.createElement("div");
        topicHeader.textContent = topic.title;
        topicHeader.style.cursor = "pointer";
  
        const topicArrow = document.createElement("span");
        topicArrow.textContent = " ▶ ";
        topicArrow.style.marginRight = "5px";
  
        topicHeader.prepend(topicArrow);
  
        const lessonList = document.createElement("ul");
        lessonList.style.marginLeft = "15px";
        lessonList.style.overflow = "hidden";
        lessonList.style.transition = "max-height 0.3s ease-out, padding 0.3s ease-out";
        lessonList.style.maxHeight = "0px";
  
        topicHeader.addEventListener("click", () => {
          toggleDropdown(lessonList, topicArrow, topicList);
        });
  
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
            // Xóa lớp 'active' cho tất cả các bài học khác
            document
              .querySelectorAll(`#${courseListId} li ul li`)
              .forEach((item) => {
                item.classList.remove("active");
              });
          
            // Thêm lớp 'active' cho bài học hiện tại
            lessonItem.classList.add("active");
          
            // Cập nhật dữ liệu vào localStorage và gọi callback
            localStorage.setItem("selectedLessonKey", lessonItem.dataset.lessonKey);
            lessonCallback(lesson);
          });
  
          lessonList.appendChild(lessonItem);
        });
  
        topicItem.appendChild(topicHeader);
        topicItem.appendChild(lessonList);
        topicList.appendChild(topicItem);
      });
  
      sessionItem.appendChild(sessionHeader);
      sessionItem.appendChild(topicList);
      courseList.appendChild(sessionItem);
    });
  }
  
  
  function toggleDropdown(list, arrow, parentList = null) {
    if (list.style.maxHeight === "0px") {
      list.style.maxHeight = list.scrollHeight + "px";
      list.style.padding = "5px";
      arrow.textContent = " ▼ ";
  
      setTimeout(() => {
        list.style.maxHeight = "none";
      }, 300); 
  
      if (parentList) {
        parentList.style.maxHeight = "none"; 
      }
    } else {
      list.style.maxHeight = list.scrollHeight + "px"; 
      setTimeout(() => {
        list.style.maxHeight = "0px";
        list.style.padding = "0";
        arrow.textContent = " ▶ ";
      }, 10);
    }
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
  
    const totalLessons = document.querySelectorAll('[data-lesson-key]').length;
    updateProgress(unlockedLessons.length, totalLessons); // Cập nhật tiến độ sau khi mở khóa
  }
  function updateProgress(unlockedCount, totalLessons) {
    const progressBar = document.querySelector(".bg-sky-600");
    const progressText = document.querySelector(".font-bold");
    
    const progressPercent = Math.round((unlockedCount / totalLessons) * 100);
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}%`;
  }  
