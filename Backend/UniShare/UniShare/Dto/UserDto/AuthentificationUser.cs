using System.ComponentModel.DataAnnotations;
using UniShare.Models;

namespace UniShare.Dto.UserDto
{
    public class AuthentificationUser
    {
        public string Username { get; set;}
        public string Password { get; set;}
        [EmailAddress]
        public string EmailAdress { get; set;}

        public UserRole Role { get; set; }
    }
}
