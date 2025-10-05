using CourseFlow.backend.Models;

namespace CourseFlow.backend.Services
{
    public interface IRatingService
    {
        Task<IEnumerable<Rating>> GetAllRatings();
        Task<Rating> GetRatingById(int id);
        Task<Rating> CreateRating(Rating rating);
        Task<Rating> UpdateRating(int id, Rating rating);
        Task<bool> DeleteRating(int id);
    }
}
