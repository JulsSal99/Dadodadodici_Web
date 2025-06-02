document.addEventListener("DOMContentLoaded", () => {
  fetch("/shared/credits.html")
    .then(response => {
      if (!response.ok) throw new Error("Errore nel caricamento della modale");
      return response.text();
    })
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    })
    .catch(error => {
      console.error("Errore nel caricamento della modale:", error);
    });
});
