namespace CourseFlow.backend.Models.DTOs
{
    public class ProgressUpdateDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public int ProgressPercent { get; set; }
    }
}
