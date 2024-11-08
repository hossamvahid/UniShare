using System.ComponentModel.DataAnnotations;

namespace UniShare.Dto.UserDto
{
    public class AuthorizationUser
    { 
        [EmailAddress]
        public string EmailAdress { get; set; }
        public string Password { get; set; }
       
    }
}
