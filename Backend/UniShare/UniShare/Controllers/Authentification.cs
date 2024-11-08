using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly IConfiguration _configuration;
        public Authentification(AppDbContext appDbContext, IConfiguration configuration)
        {
            _appDbContext = appDbContext;
            _configuration = configuration;
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

        [HttpPost("SingIn")]
        public  async Task<IActionResult>SignIn(AuthorizationUser userRequest)
        {
            if (userRequest.EmailAdress is null || userRequest.Password is null)
            {
                return BadRequest("Please fill all the requierd spaces");
            }

            var user = _appDbContext.Users.FirstOrDefault(x => x.EmailAdress == userRequest.EmailAdress);
            if (user == null)
            {
                return BadRequest("Email is not vallid");
            }

            bool valid = BCrypt.Net.BCrypt.Verify(userRequest.Password, user.Password);

            if (!valid) 
            { 
                return BadRequest("Password is not vallid"); 
            }

            var claim = new[]
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name,user.Username)

            };

            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]));
            var credentials= new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
             issuer: _configuration["JwtConfig:Issuer"],
             audience: _configuration["JwtConfig:Audience"],
             claims: claim,              
            expires: DateTime.Now.AddHours(1),  
             signingCredentials: credentials
            );

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwtToken });



        }
    }
}
