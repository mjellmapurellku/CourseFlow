namespace CourseFlow.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Level { get; set; } // Beginner, Intermediate, Advanced
        public int InstructorId { get; set; }
        public User Instructor { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<Rating> Ratings { get; set; }
    }
}
