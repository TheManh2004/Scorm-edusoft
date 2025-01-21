export function initializeSidebar(data, courseListId, lessonCallback) {
  const courseList = document.getElementById(courseListId);
  let firstLessonInitialized = false;

  const selectedLessonKey = localStorage.getItem('selectedLessonKey');

  data.courses.forEach(course => {
    const courseItem = document.createElement('li');

   
    const arrow = document.createElement('span');
    arrow.textContent = '▶'; 
    arrow.style.cursor = 'pointer';
    arrow.style.marginRight = '10px';

  
    const courseTitle = document.createElement('span');
    courseTitle.textContent = course.title;
    courseTitle.style.fontWeight = 'bold';

    const lessonCount = document.createElement('span');
    lessonCount.textContent = `(${course.lessons.length} bài học)`;
    lessonCount.style.fontSize = '12px';
    lessonCount.style.color = '#666'; 
    lessonCount.style.marginLeft = '10px'; 

    
    courseItem.appendChild(arrow);
    courseItem.appendChild(courseTitle);
    courseItem.appendChild(lessonCount);

    const lessonList = document.createElement('ul');
    lessonList.style.height = '0'; 
    lessonList.style.transition = 'height 0.5s ease-out, padding 0.5s ease-out'; 
    lessonList.style.overflow = 'hidden'; 

    course.lessons.forEach(lesson => {
      const lessonItem = document.createElement('li');
      lessonItem.textContent = lesson.title;

      const lessonKey = `${course.id}-${lesson.id}`;

      if (selectedLessonKey === lessonKey) {
        lessonItem.classList.add('active');
        lessonCallback(lesson);
        lessonList.style.height = 'auto'; 
        lessonList.style.overflow = 'visible';
        arrow.textContent = '▼'; 
      }

      lessonItem.addEventListener('click', (event) => {
        event.stopPropagation();

        localStorage.setItem('selectedLessonKey', lessonKey);

        document.querySelectorAll(`#${courseListId} li ul li`).forEach(item => {
          item.classList.remove('active');
        });

        lessonItem.classList.add('active');
        lessonCallback(lesson);
      });

      lessonList.appendChild(lessonItem);

      if (!firstLessonInitialized && !selectedLessonKey) {
        firstLessonInitialized = true;
        lessonItem.classList.add('active');
        lessonCallback(lesson);
        lessonList.style.height = 'auto'; 
        lessonList.style.overflow = 'visible';
        lessonList.style.padding = '10px'; 
        arrow.textContent = '▼'; 
      }
    });

    const toggleLessonList = () => {
      const isExpanded = lessonList.style.height === 'auto';

      if (isExpanded) {
        lessonList.style.height = '0';
        lessonList.style.overflow = 'hidden';
        lessonList.style.padding = '0';
        arrow.textContent = '▶'; 
      } else {
        lessonList.style.height = 'auto'; 
        lessonList.style.overflow = 'visible';
        lessonList.style.padding = '5px'; 
        arrow.textContent = '▼';
      }
    };

    courseItem.addEventListener('click', toggleLessonList);
    arrow.addEventListener('click', (event) => {
      event.stopPropagation(); 
      toggleLessonList();
    });

    courseItem.appendChild(lessonList);
    courseList.appendChild(courseItem);
  });
}
