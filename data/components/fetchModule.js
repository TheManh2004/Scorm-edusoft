document.addEventListener("DOMContentLoaded", function () {

    fetch("./data/json/course.json") 
        .then(response => {
            return response.json();
        })
        .then(data => {

            const moduleList = document.getElementById("module-list");

            data.sessions.forEach((session, index) => {
                const moduleDiv = document.createElement("div");
                moduleDiv.classList = "border border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer";

                moduleDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="text-lg font-semibold">Module ${index + 1}: ${session.title}</h4>
                        <span class="arrow transition-transform transform duration-300">&#9662;</span>
                    </div>
                    <div class="lesson-list hidden mt-3 space-y-2"></div>
                `;

                const lessonList = moduleDiv.querySelector(".lesson-list");

                session.topics.forEach(lesson => {
                    const lessonItem = document.createElement("p");
                    lessonItem.classList = "pl-4 text-gray-700 text-sm";
                    lessonItem.textContent = `• ${lesson.title}`;
                    lessonList.appendChild(lessonItem);
                });

                moduleDiv.addEventListener("click", function () {
                    lessonList.classList.toggle("hidden");
                    moduleDiv.querySelector(".arrow").classList.toggle("rotate-180");
                });

                moduleList.appendChild(moduleDiv);
            });
        })
});
