const loginButton = document.querySelector('.login-button');
const eyeIcon = document.getElementById('eyeIcon');
const passwordInput = document.getElementById('password');
const circleSper=document.getElementById('circle');

eyeIcon.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }
});

loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const emailAdress = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(emailAdress);
    console.log(password);

    const userRequest = {
        EmailAdress: emailAdress,
        Password: password
    };

    fetch('https://localhost:7209/api/Authentification/SingIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userRequest)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log('Token: ', data.token);
            localStorage.setItem('authToken', data.token);
            window.location.href = '/LecturePage/lecture.html';
        } else {
            console.error('Login error token not received error message: ', data.error);
            alert("Email/Password incorrect");
        }
    })
    .catch(error => {
        console.error('Error at request: ', error);
        alert('An error occurred. Please try again later.');
    });
});



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

// Toggle visibility of the menu when "button" (menu icon) is clicked
const showMenu = document.getElementById('button');
showMenu.addEventListener('click', () => {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.classList.add('hidden');
    loginContainer.classList.remove('visible');

    const menu = document.getElementById('menu');
    menu.classList.add('visible');
    menu.classList.remove('hidden');
});

// Toggle back to the login form when "buttonMenu" (back icon) is clicked
const showLoginForm = document.getElementById("buttonMenu");
showLoginForm.addEventListener('click', () => {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.classList.add('visible');
    loginContainer.classList.remove('hidden');

    const menu = document.getElementById('menu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
});

