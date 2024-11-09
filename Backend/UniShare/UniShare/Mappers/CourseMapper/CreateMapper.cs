using UniShare.Dto.CourseDto;
using UniShare.Dto.UserDto;
using UniShare.Models;

namespace UniShare.Mappers.CourseMapper
{
    public class CreateMapper
    {
        public CourseModel MapToCourse(CreateCourse createCourse)
        {
            return new CourseModel
            {
               Name= createCourse.Name,
               Description= createCourse.Description,
               Category= createCourse.Category
            };
        }

        public CreateCourse MapToCreate(CourseModel user)
        {
            return new CreateCourse
            {
                Name = user.Name,
                Description = user.Description,
                Category= user.Category

            };
        }
    }
}
