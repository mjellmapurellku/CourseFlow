namespace CourseFlow.backend.Models.DTOs
{
    public class UserDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }

        public string? Username { get; set; }
    }
}
