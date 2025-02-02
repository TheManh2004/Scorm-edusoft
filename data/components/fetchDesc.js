
  function loadContent(id, url) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      })
      .catch(error => console.error('Error loading content:', error));
  }

  loadContent("about-container", "./data/about.html");
  loadContent("module-container", "./data/module.html");