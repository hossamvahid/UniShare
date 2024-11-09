using System.ComponentModel.DataAnnotations.Schema;
using UniShare.Models;

namespace UniShare.Dto.CourseDto
{
    public class CreateCourse
    {
     

        [Column("CourseName")]
        public string Name { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("Category")]
        public Category Category { get; set; }

        [Column("UserId")]
        public int UserId { get; set; }
    }
}
