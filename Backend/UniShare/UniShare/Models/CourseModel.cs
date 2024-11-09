using System.ComponentModel.DataAnnotations.Schema;

namespace UniShare.Models
{
    public enum Category { Programing, Mathematics}
    public class CourseModel
    {
        [Column("id")]
        public int Id { get; set; }

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
