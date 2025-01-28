const params = new URLSearchParams(window.location.search);
const blockedUrl = params.get("url");

// Mostrar la URL bloqueada en la página
if (blockedUrl) {
  document.getElementById("urlSpan").textContent = decodeURIComponent(blockedUrl);
} else {
  document.getElementById("urlSpan").textContent = "No disponible.";
}