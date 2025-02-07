export function setupTabs(videoTabId, contentTabId, videoSectionId, contentSectionId) {
    const videoTab = document.getElementById(videoTabId);
    const contentTab = document.getElementById(contentTabId);
    const videoSection = document.getElementById(videoSectionId);
    const contentSection = document.getElementById(contentSectionId);

    const selectedTab = localStorage.getItem("selectedTab");

    if (selectedTab === "content") {
        videoSection.style.display = "none";
        contentSection.style.display = "block";
        videoTab.classList.remove("active");
        contentTab.classList.add("active");
    } else {
        videoSection.style.display = "block";
        contentSection.style.display = "none";
        videoTab.classList.add("active");
        contentTab.classList.remove("active");
    }

    videoTab.addEventListener("click", () => toggleTab("video"));
    contentTab.addEventListener("click", () => toggleTab("content"));

    function toggleTab(tab) {
        videoSection.style.display = tab === "video" ? "block" : "none";
        contentSection.style.display = tab === "content" ? "block" : "none";

        if (tab === "video") {
            videoTab.classList.add("active");
            contentTab.classList.remove("active");
        } else {
            contentTab.classList.add("active");
            videoTab.classList.remove("active");
        }

        localStorage.setItem("selectedTab", tab);
    }


    const subTabs = document.querySelectorAll(".sub-tab");
    const subContents = document.querySelectorAll(".sub-content");

    subTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            subTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            subContents.forEach(content => content.style.display = "none");

            const tabId = this.id.replace("-tab", "-section");
            document.getElementById(tabId).style.display = "block";
        });
    });
}
