// Selectează imaginea și butonul
const imagine = document.getElementById("img-mare");
const closeButton = document.getElementById("close-button");

// Adaugă un eveniment de click pe butonul de închidere
closeButton.addEventListener("click", function() {
    imagine.style.display = "none";      // Ascunde imaginea
    closeButton.style.display = "none";  // Ascunde și butonul
});
