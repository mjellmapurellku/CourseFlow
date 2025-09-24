using CourseFlow.Models;

namespace CourseFlow.Repositories
{
    public interface IEnrollmentRepository : IRepository<Enrollment>
    {
        Task<IEnumerable<Enrollment>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Enrollment>> GetByCourseIdAsync(int courseId);
    }
}
