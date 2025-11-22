using System.ComponentModel.DataAnnotations.Schema;

namespace CourseFlow.backend.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Level { get; set; }
        public double? Rating { get; set; }  
        public int? Students { get; set; }   
        public string Duration { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        public string Image { get; set; } 
        public string VideoUrl { get; set; } 
        public int InstructorId { get; set; }
        public User? Instructor { get; set; } 
        public ICollection<Enrollment>? Enrollments { get; set; } 
        public ICollection<Rating>? Ratings { get; set; }
        public ICollection<Lesson>? Lessons { get; set; }

    }
}
