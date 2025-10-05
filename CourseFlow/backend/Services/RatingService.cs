using CourseFlow.backend.Models;
using CourseFlow.backend.Repositories;
using Microsoft.Extensions.Logging;

namespace CourseFlow.backend.Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly ILogger<RatingService> _logger;

        public RatingService(IRatingRepository ratingRepository, ILogger<RatingService> logger)
        {
            _ratingRepository = ratingRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Rating>> GetAllRatings()
        {
            _logger.LogInformation("Fetching all ratings");
            return await _ratingRepository.GetAllSync();
        }

        public async Task<Rating?> GetRatingById(int id)
        {
            _logger.LogInformation("Fetching rating with Id {Id}", id);
            return await _ratingRepository.GetByIdSync(id);
        }

        public async Task<Rating> CreateRating(Rating rating)
        {
            _logger.LogInformation(
                "Creating rating for User {UserId}, Course {CourseId}, Stars {Stars}",
                rating.UserId, rating.CourseId, rating.Stars);

            await _ratingRepository.AddAsync(rating);
            return rating;
        }

        public async Task<Rating?> UpdateRating(int id, Rating rating)
        {
            _logger.LogInformation("Updating rating with Id {Id}", id);

            var existing = await _ratingRepository.GetByIdSync(id);
            if (existing == null)
            {
                _logger.LogWarning("Rating with Id {Id} not found", id);
                return null;
            }

            existing.Stars = rating.Stars;
            existing.Comment = rating.Comment;
            existing.Date = rating.Date;
            existing.UserId = rating.UserId;
            existing.CourseId = rating.CourseId;

            await _ratingRepository.UpdateAsync(existing);
            _logger.LogInformation("Rating with Id {Id} updated successfully", id);

            return existing;
        }

        public async Task<bool> DeleteRating(int id)
        {
            _logger.LogInformation("Deleting rating with Id {Id}", id);

            var existing = await _ratingRepository.GetByIdSync(id);
            if (existing == null)
            {
                _logger.LogWarning("Rating with Id {Id} not found", id);
                return false;
            }

            await _ratingRepository.DeleteAsync(id);
            _logger.LogInformation("Rating with Id {Id} deleted successfully", id);

            return true;
        }
    }
}
