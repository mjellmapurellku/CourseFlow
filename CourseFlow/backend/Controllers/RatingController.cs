using CourseFlow.backend.Models;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseFlow.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rating>>> GetRatings()
            => Ok(await _ratingService.GetAllRatings());

        [HttpGet("{id}")]
        public async Task<ActionResult<Rating>> GetRating(int id)
        {
            var rating = await _ratingService.GetRatingById(id);
            if (rating == null) return NotFound();
            return Ok(rating);
        }

        [HttpPost]
        public async Task<ActionResult<Rating>> CreateRating(Rating rating)
        {
            var created = await _ratingService.CreateRating(rating);
            return CreatedAtAction(nameof(GetRating), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, Rating rating)
        {
            var updated = await _ratingService.UpdateRating(id, rating);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var deleted = await _ratingService.DeleteRating(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
