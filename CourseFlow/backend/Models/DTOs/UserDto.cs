namespace CourseFlow.backend.Models.DTOs
{
    public class UserDto
    {
        public string? FullName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Username { get; set; }
        public string? Role { get; set; } // Admin, Instructor, Student
    }
}
