namespace CourseFlow.backend.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public int Stars { get; set; } // 1-5
        public string Comment { get; set; }
        public DateTime Date { get; set; }
    }
}
