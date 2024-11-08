using Microsoft.EntityFrameworkCore;
using UniShare.Models;

namespace UniShare.Database
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<UserModel>Users { get; set; }
    }
}
