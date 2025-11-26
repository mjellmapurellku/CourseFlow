using CourseFlow.backend.Models;

namespace CourseFlow.backend.Services
{
    public interface IEnrollmentService
    {
        Task<IEnumerable<Enrollment>> GetAllEnrollments();
        Task<Enrollment> GetEnrollmentById(int id);
        Task<Enrollment> CreateEnrollment(Enrollment enrollment);
        Task<Enrollment> UpdateEnrollment(int id, Enrollment enrollment);
        Task<bool> DeleteEnrollment(int id);
        Task<bool> ExistsAsync(int userId, int courseId);
        Task<IEnumerable<Enrollment>> GetByUserIdAsync(int userId);
        Task<Enrollment?> GetByUserAndCourseAsync(int userId, int courseId);
        Task<Enrollment?> UpdateProgress(int userId, int courseId, int progressPercent);
    }
}
