namespace CourseFlow.backend.Models.DTOs
{
    public class CheckoutRequestDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public string Email { get; set; }
    }
}
