import { fetchData } from './fetchData.js';
import { initializeSidebar } from './sidebar.js';
import { loadLessonContent } from './lesson.js';
import { setupTabs } from './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
    const url = '../json/course.json';

    fetchData(url, data => {
        initializeSidebar(data.sessions, 'course-list', lesson => {
            loadLessonContent(lesson, 'video-frame', 'video-description', 'material-list','content-list', 'loading-indicator');
        });
    });

    setupTabs('video-tab', 'content-tab', 'video-section', 'content-section');
});
