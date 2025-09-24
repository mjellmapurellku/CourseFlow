using CourseFlow.Models;

namespace CourseFlow.Repositories
{
    public interface IRatingRepository
    {
        Task<IEnumerable<Rating>> GetAllSync();
        Task<Rating> GetByIdSync(int id);
        Task AddAsync(Rating rating);
        Task UpdateAsync(Rating rating);
        Task DeleteAsync(int id);
    }
}
