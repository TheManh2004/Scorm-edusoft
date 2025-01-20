export function loadLessonContent(lesson, videoFrameId, descriptionId, materialListId, loadingIndicatorId) {
    const videoFrame = document.getElementById(videoFrameId);
    const loadingIndicator = document.getElementById(loadingIndicatorId);
  
    loadingIndicator.style.display = 'block';
    videoFrame.style.display = 'none';
  
    videoFrame.src = lesson.video.url;
    document.getElementById(descriptionId).innerHTML = lesson.video.description;
  
    const materialList = document.getElementById(materialListId);
    materialList.innerHTML = '';
  
    lesson.materials.forEach(material => {
      const materialItem = document.createElement('li');
      materialItem.innerHTML = `<a href="${material.url}" target="_blank">${material.name}</a>`;
      materialList.appendChild(materialItem);
    });
  
    videoFrame.onload = () => {
      loadingIndicator.style.display = 'none';
      videoFrame.style.display = 'block';
    };
  }
  