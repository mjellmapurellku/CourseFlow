using CourseFlow.Models;
using CourseFlow.Repositories;

namespace CourseFlow.Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;

        public RatingService(IRatingRepository ratingRepository)
        {
            _ratingRepository = ratingRepository;
        }

        public async Task<IEnumerable<Rating>> GetAllRatings()
            => await _ratingRepository.GetAllSync();

        public async Task<Rating?> GetRatingById(int id)
            => await _ratingRepository.GetByIdSync(id);

        public async Task<Rating> CreateRating(Rating rating)
        {
            await _ratingRepository.AddAsync(rating);
            return rating;
        }

        public async Task<Rating?> UpdateRating(int id, Rating rating)
        {
            var existing = await _ratingRepository.GetByIdSync(id);
            if (existing == null) return null;

            existing.Stars = rating.Stars;
            existing.Comment = rating.Comment;
            existing.Date = rating.Date;
            existing.UserId = rating.UserId;
            existing.CourseId = rating.CourseId;

            await _ratingRepository.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteRating(int id)
        {
            var existing = await _ratingRepository.GetByIdSync(id);
            if (existing == null) return false;

            await _ratingRepository.DeleteAsync(id);
            return true;
        }
    }
}
