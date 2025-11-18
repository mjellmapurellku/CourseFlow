namespace CourseFlow.backend.Models.DTOs
{
    public class EnrollmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int ProgressPercent { get; set; }
        public int CompletedLessons { get; set; }
    }
}
