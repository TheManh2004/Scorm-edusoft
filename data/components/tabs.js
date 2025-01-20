export function setupTabs(videoTabId, materialTabId, videoSectionId, materialSectionId) {
    const videoTab = document.getElementById(videoTabId);
    const materialTab = document.getElementById(materialTabId);
    const videoSection = document.getElementById(videoSectionId);
    const materialSection = document.getElementById(materialSectionId);


    const selectedTab = localStorage.getItem('selectedTab');


    if (selectedTab === 'material') {
        videoSection.style.display = 'none';
        materialSection.style.display = 'block';
        videoTab.classList.remove('active');
        materialTab.classList.add('active');
    } else {
        videoSection.style.display = 'block';
        materialSection.style.display = 'none';
        videoTab.classList.add('active');
        materialTab.classList.remove('active');
    }

    videoTab.addEventListener('click', () => toggleTab('video'));
    materialTab.addEventListener('click', () => toggleTab('material'));

   function toggleTab(tab) {

        videoSection.style.display = tab === 'video' ? 'block' : 'none';
        materialSection.style.display = tab === 'material' ? 'block' : 'none';

        if (tab === 'video') {
            videoTab.classList.add('active');
            materialTab.classList.remove('active');
        } else {
            materialTab.classList.add('active');
            videoTab.classList.remove('active');
        }

      
        localStorage.setItem('selectedTab', tab);
    }
}
