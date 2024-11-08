
const loginButton = document.querySelector('.login-button');



loginButton.addEventListener('click', (event) => {
  //clickLogin.style.display = 'block'; // Show the message
  
    event.preventDefault();

    const emailAdress=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    console.log(emailAdress);
    console.log(password);

    const userRequest={

      EmailAdress:emailAdress,
      Password:password
    };

    fetch('https://localhost:7209/api/Authentification/SingIn',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userRequest)
    })
    .then(response=>response.json())
    .then(data=>{
      if(data.token)
      {
        console.log('Token: ',data.token);
        localStorage.setItem('authToken',data.token);
        window.location.href='/HomePage/home.html';

      }else
      {
         console.error('Login error token not received error message: ', data.error);
          
      }
    })
    .catch(error=>{
      console.error('Error at request: ',error);
      alert('An error occurred. Please try again later.');
    });

});
