namespace CourseFlow.backend.Models.DTOs
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
