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
