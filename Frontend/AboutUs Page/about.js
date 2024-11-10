
const circle = document.querySelector('.circle');
const container = document.querySelector('.about-container');
const radius = 300; // Radius of the circular motion
const speed = 0.014; // Speed of movement

let angle = 0; // Initial angle for animation

function animate() {
    // Get the center of the .about-container
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    // Calculate new x and y positions for the circle
    const x = centerX + radius * Math.cos(angle) - circle.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - circle.offsetHeight / 2;

    // Apply new position using translate
    circle.style.transform = `translate(${x}px, ${y}px)`;
   
    // Increment angle to create continuous movement
    angle += speed;

    requestAnimationFrame(animate); // Continue animation
}

// Start the animation
animate();
