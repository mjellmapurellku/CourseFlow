using CourseFlow.backend.Models;

namespace CourseFlow.backend.Repositories
{
    public interface ICourseRepository : IRepository<Course>
    {
        Task<IEnumerable<Course>> GetByCategoryAsync(string category);
        Task<IEnumerable<Course>> GetByInstructorIdAsync(int instructorId);
    }
}
