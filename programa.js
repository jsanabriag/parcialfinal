document.addEventListener("DOMContentLoaded", function() {
    const titulo = document.querySelector("h1");
    titulo.style.opacity = "0";
    setTimeout(() => {
        titulo.style.transition = "opacity 2s";
        titulo.style.opacity = "1";
    }, 500);
});
