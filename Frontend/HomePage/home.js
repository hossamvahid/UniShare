// Toggle visibility of the menu when "button" (menu icon) is clicked
const showMenu = document.getElementById('button');
showMenu.addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper'); // Select the main content
    wrapper.classList.add('hidden');
    wrapper.classList.remove('visible');

    const menu = document.getElementById('menu'); // Show the menu
    menu.classList.add('visible');
    menu.classList.remove('hidden');
});

// Toggle back to the main content when "buttonMenu" (back icon) is clicked
const showMainContent = document.getElementById("buttonMenu");
showMainContent.addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper'); // Show the main content
    wrapper.classList.add('visible');
    wrapper.classList.remove('hidden');

    const menu = document.getElementById('menu'); // Hide the menu
    menu.classList.add('hidden');
    menu.classList.remove('visible');
});

const circleSper=document.getElementById('circle');
const circles = document.querySelectorAll('.circle');
const radius = 300; // Raza cercului de mișcare
const speed = 0.014; // Viteza mișcării

circles.forEach((circle, index) => {
  let angle = index * (Math.PI /2); // Offset de un sfert de cerc între elemente
  
  function animate() {
    angle += speed; // Incrementăm unghiul pentru a crea mișcarea
    const x = radius * Math.cos(angle); // Calculăm coordonata X
    const y = radius * Math.sin(angle); // Calculăm coordonata Y
    
    // Aplicăm transformarea pentru poziționare
    circle.style.transform = `translate(${x}px, ${y}px)`;
    
    requestAnimationFrame(animate); // Continuăm animația
  }

  animate();
});