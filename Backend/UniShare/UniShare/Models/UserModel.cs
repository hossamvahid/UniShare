using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace UniShare.Models
{
    public class UserModel
    {
        [Column("Id")]
        public int Id { get; set; }

        [Column("Email")]
        [EmailAddress]
        public string EmailAddress { get; set; }

        [Column("Username")]
        public string Username { get; set; }

        [Column("Password")]
        public string Password { get; set; }
    }
}
