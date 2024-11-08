using UniShare.Dto.UserDto;
using UniShare.Models;

namespace UniShare.Mappers.UserMapper
{
    public class AuthentificationMapper
    {
        public UserModel MapToUser (AuthentificationUser authentificationUser)
        {
            return new UserModel
            {
                EmailAdress = authentificationUser.EmailAdress,
                Username = authentificationUser.Username,
                Password = authentificationUser.Password
            };
        }

        public AuthentificationUser MapToAuth(UserModel user)
        {
            return new AuthentificationUser
            {
                EmailAdress = user.EmailAdress,
                Username = user.Username,
                Password = user.Password
            };
        }
    }
}
