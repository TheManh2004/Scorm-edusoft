import { fetchData } from './fetchData.js';
import { initializeSidebar } from './sidebar.js';
import { loadLessonContent } from './lesson.js';
import { setupTabs } from './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const url = '/data/json/course.json';

  fetchData(url, data => {
    initializeSidebar(data, 'course-list', lesson => {
      loadLessonContent(lesson, 'video-frame', 'video-description', 'material-list', 'loading-indicator');
    });
  });

  setupTabs('video-tab', 'material-tab', 'video-section', 'material-section');
});
