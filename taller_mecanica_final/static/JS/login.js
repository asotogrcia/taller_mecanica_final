//Función para el carrusel de inicio.
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".background-image");
    let currentImage = 0;

    setInterval(() => {
        images[currentImage].classList.remove("active");

        currentImage++;
        if (currentImage === images.length) {
            currentImage = 0;
        }

        images[currentImage].classList.add("active");
    }, 7000); // Cambia imagen cada 5 segundos
});

function toggleLogin() {
    const loginSpan = document.getElementById('login-span');
    loginSpan.addEventListener('click', function(){
        window.location.href = "/";
    });
};

function toggleRegister() {
    const registerSpan = document.getElementById('register-span');
    registerSpan.addEventListener('click', function(){
        window.location.href = "register/";
    });
}