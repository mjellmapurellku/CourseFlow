namespace CourseFlow.backend.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public bool IsPaid { get; set; } = false;
        public string? StripeSessionId { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int ProgressPercent { get; set; } = 0;
        public int CompletedLessons { get; set; } = 0;
    }
}
