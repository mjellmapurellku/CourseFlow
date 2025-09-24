using CourseFlow.Models;

namespace CourseFlow.Repositories
{
    public interface ICourseRepository : IRepository<Course>
    {
        Task<IEnumerable<Course>> GetByCategoryAsync(string category);
        Task<IEnumerable<Course>> GetByInstructorIdAsync(int instructorId);
    }
}
