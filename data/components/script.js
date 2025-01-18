
fetch('./data/json/data.json')
  .then(response => response.json())
  .then(data => initializeSidebar(data));

function initializeSidebar(data) {
  const courseList = document.getElementById('course-list');

  data.courses.forEach(course => {
    const courseItem = document.createElement('li');
    courseItem.textContent = course.title;

    const lessonList = document.createElement('ul');
    lessonList.style.display = 'none';

    course.lessons.forEach(lesson => {
      const lessonItem = document.createElement('li');
      lessonItem.textContent = lesson.title;

      lessonItem.addEventListener('click', () => loadLessonContent(lesson));

      lessonList.appendChild(lessonItem);
    });

    courseItem.addEventListener('click', () => {
      lessonList.style.display = lessonList.style.display === 'none' ? 'block' : 'none';
    });

    courseItem.appendChild(lessonList);
    courseList.appendChild(courseItem);
  });
}

function loadLessonContent(lesson) {
    const videoFrame = document.getElementById('video-frame');
    const loadingIndicator = document.getElementById('loading-indicator');
  
    
    loadingIndicator.style.display = 'block';
    videoFrame.style.display = 'none';
  
    videoFrame.src = lesson.video.url;
    document.getElementById('video-description').innerHTML = lesson.video.description;
  
    const materialList = document.getElementById('material-list');
    materialList.innerHTML = '';
  
    lesson.materials.forEach(material => {
      const materialItem = document.createElement('li');
      materialItem.innerHTML = `<a href="${material.url}" target="_blank">${material.name}</a>`;
      materialList.appendChild(materialItem);
    });
  
    toggleTab('video');
  
    videoFrame.onload = () => {
      loadingIndicator.style.display = 'none';
      videoFrame.style.display = 'block';
    };
  }
  
  document.getElementById('video-tab').addEventListener('click', () => toggleTab('video'));
  document.getElementById('material-tab').addEventListener('click', () => toggleTab('material'));
  
  function toggleTab(tab) {
    document.getElementById('video-section').style.display = tab === 'video' ? 'block' : 'none';
    document.getElementById('material-section').style.display = tab === 'material' ? 'block' : 'none';
  }
