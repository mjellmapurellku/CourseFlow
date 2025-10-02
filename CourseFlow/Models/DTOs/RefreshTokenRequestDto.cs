namespace CourseFlow.Models.DTOs
{
    public class RefreshTokenRequestDto
    {
        public int Id { get; set; }
        public required string RefreshToken { get; set; }
    }
}
