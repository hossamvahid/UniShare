using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniShare.Database;
using UniShare.Dto.UserDto;
using UniShare.Models;

namespace UniShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Authentification : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public Authentification(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> SignIn(AuthentificationUser userRequest)
        {
            if (userRequest.EmailAdress is null || userRequest.Username is null||userRequest.Password is null) 
            {
                return BadRequest("Please fill all the requierd spaces");
            }
            bool found=_appDbContext.Users.Any(x=>x.EmailAdress == userRequest.EmailAdress||x.Username==userRequest.Username);

            if(found==true)
            {
                return BadRequest("The email already exist");
            }

           
            userRequest.Password=BCrypt.Net.BCrypt.HashPassword(userRequest.Password);
            var user = new UserModel
            {
                EmailAdress = userRequest.EmailAdress,
                Username = userRequest.Username,
                Password = userRequest.Password

            };
            await _appDbContext.AddAsync(user);
            await _appDbContext.SaveChangesAsync();

            return Ok(userRequest);
        }

        [HttpGet("Sing")]
    }
}
