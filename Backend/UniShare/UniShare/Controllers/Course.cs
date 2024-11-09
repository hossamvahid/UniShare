using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using UniShare.Database;
using UniShare.Dto.CourseDto;
using UniShare.Models;

namespace UniShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Course : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public Course(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("CourseCreate")]
        public async Task<IActionResult> Create(CreateCourse courseRequest)
        {
            var course = new CourseModel
            {
                Name = courseRequest.Name,
                Description = courseRequest.Description,
                Category = courseRequest.Category
            };

            var userIdClaim = this.User.Claims.FirstOrDefault(x => x.Type == "UserId");
            
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                  course.UserId = userId;            
            }
            else
            {
               return BadRequest("User ID-ul was not found.");
            }


            var courseExist= await _appDbContext.Courses.AnyAsync(x=>x.Name == courseRequest.Name||x.Id==course.UserId);

            if(courseExist) 
            {
                return BadRequest("The course already was created");            
            }

            await _appDbContext.Courses.AddAsync(course);
            await _appDbContext.SaveChangesAsync();

            return Ok(course);

         }




    }
}
