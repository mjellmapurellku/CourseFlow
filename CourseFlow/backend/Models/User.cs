using CourseFlow.backend.Enums;

namespace CourseFlow.backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } 
        public UserRoles Role { get; set; } // Student, Instructor, Admin
        public string? Preferences { get; set; } // JSON ose lista e interesave
        public string? RefreshToken { get; set; } // JSON ose lista e interesave
        public DateTime? RefreshTokenExpiryTime { get; set; } // JSON ose lista e interesave
        public ICollection<Enrollment>? Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Rating>? Ratings { get; set; } = new List<Rating>();

    }
}
