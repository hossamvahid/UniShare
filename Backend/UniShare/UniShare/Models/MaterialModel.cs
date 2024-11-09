using System.ComponentModel.DataAnnotations.Schema;

namespace UniShare.Models
{
    public class MaterialModel
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("FileName")]
        public string FileName { get; set; }

        [Column("Bucket")]
        public string Bucket { get; set; }

        [Column("CourseId")]
        public int CourseId { get; set; }

    }
}
