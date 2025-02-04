
  function loadContent(id, url) {
    fetch(url, {mode: "no-cors"})
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      })
      
  }

  loadContent("about-container", "./data/view/about.html");
  loadContent("module-container", "./data/view/module.html");