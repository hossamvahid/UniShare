const signUp = document.querySelector('button'); 

signUp.addEventListener('click', (event) => {
    event.preventDefault(); 

    const emailAdress = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('name').value;
    const confirm = document.getElementById('confirm').value;
    const roleSelected = document.getElementById('status').value; 

   
    if (password !== confirm) {
        alert("The password does not match");
        return; 
    }

    
    const role = roleSelected === 'Teacher' ? 0 : 1; 

   
    const request = {
         Username: username, 
        Password: password, 
        EmailAdress: emailAdress,
        Role: role
    };
  
     fetch('https://localhost:7209/api/Authentification/SignUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request) 
    })
    .then(response => {
        if(!response.ok)
        {
            return  response.json().then(error=>{
                throw new Error(error.error);
            });
        }
        response.json();
    }) 
    .then(data => {
        alert("User created succsefuly");
        window.location.href = '/LoginPage/login.html';
    })
    .catch(error => {
        console.error('Error at request: ', error);
        alert(error.message);
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

const passwordInput=document.getElementById('password');
const confirmPassword=document.getElementById('confirm');
const eyeIcon=document.getElementById('eyeIcon');
const eyeIcon2=document.getElementById('eyeIconConfirm');  

eyeIcon.addEventListener('click',()=>{
    if(passwordInput.type==='password'){
        passwordInput.type='text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    }
    else{
        passwordInput.type='password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }   
});

eyeIconConfirm.addEventListener('click',()=>{
    if(confirmPassword.type==='password'){
        confirmPassword.type='text';
        eyeIcon2.classList.remove('bi-eye');
        eyeIcon2.classList.add('bi-eye-slash');
    }
    else{
        confirmPassword.type='password';
        eyeIcon2.classList.remove('bi-eye-slash');
        eyeIcon2.classList.add('bi-eye');
    }   
});

// Toggle visibility of the menu
const showMenu = document.getElementById('button');
showMenu.addEventListener('click', () => {
    const signUp = document.getElementById('signUp');
    signUp.classList.add('hidden');
    signUp.classList.remove('visible');

    const menu = document.getElementById('menu');
    menu.classList.add('visible');
    menu.classList.remove('hidden');
});

// Toggle back to the sign-up form
const showMaterii = document.getElementById("buttonMenu");
showMaterii.addEventListener('click', () => {
    const signUp = document.getElementById('signUp');
    signUp.classList.add('visible');
    signUp.classList.remove('hidden');

    const menu = document.getElementById('menu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
});

