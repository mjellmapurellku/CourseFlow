using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace CourseFlow.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IWebHostEnvironment _env;

        public CourseController(ICourseService courseService, IWebHostEnvironment env)
        {
            _courseService = courseService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseCreateDto>>> GetCourses()
        {
            var courses = await _courseService.GetAllCourses();

            var dtos = courses.Select(c => new CourseCreateDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category,
                Level = c.Level,
                Rating = c.Rating,
                Students = c.Students,
                Duration = c.Duration,
                Price = c.Price,
                Image = c.Image,
                VideoUrl = c.VideoUrl,
                InstructorId = c.InstructorId
            });

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseCreateDto>> GetCourseById(int id)
        {
            var c = await _courseService.GetCourseById(id);
            if (c == null) return NotFound();

            var dto = new CourseCreateDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category,
                Level = c.Level,
                Rating = c.Rating,
                Students = c.Students,
                Duration = c.Duration,
                Price = c.Price,
                Image = c.Image,
                VideoUrl = c.VideoUrl,
                InstructorId = c.InstructorId,
                Lessons = c.Lessons?.OrderBy(l => l.Order)
                         .Select(l => new LessonDto
                        {
                            Id = l.Id,
                            Title = l.Title,
                            VideoUrl = l.VideoUrl,
                            Order = l.Order
                        }).ToList()
             };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<CourseCreateDto>> CreateCourse([FromBody] CourseCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid course data");

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                Level = dto.Level,
                Category = dto.Category,
                InstructorId = dto.InstructorId,
                Duration = dto.Duration,
                Price = dto.Price,
                Image = dto.Image,
                VideoUrl = dto.VideoUrl
            };

            var created = await _courseService.CreateCourse(course);

            var response = new CourseCreateDto
            {
                Id = created.Id,
                Title = created.Title,
                Description = created.Description,
                Category = created.Category,
                Level = created.Level,
                Rating = created.Rating,
                Students = created.Students,
                Duration = created.Duration,
                Price = created.Price,
                Image = created.Image,
                VideoUrl = created.VideoUrl,
                InstructorId = created.InstructorId
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCourse(int id, [FromBody] CourseCreateDto dto)
        {
            var existing = await _courseService.GetCourseById(id);
            if (existing == null) return NotFound();

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.Level = dto.Level;
            existing.Category = dto.Category;
            existing.InstructorId = dto.InstructorId;
            existing.Duration = dto.Duration;
            existing.Price = dto.Price;
            existing.Image = dto.Image;
            existing.VideoUrl = dto.VideoUrl;

            await _courseService.UpdateCourse(id, existing);

            return Ok("Course updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var deleted = await _courseService.DeleteCourse(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("{courseId}/lessons")]
        public async Task<IActionResult> GetLessonsForCourse(int courseId, [FromServices] AppDbContext db)
        {
            var lessons = await db.Lessons
                .Where(x => x.CourseId == courseId)
                .OrderBy(x => x.Order)
                .ToListAsync();

            return Ok(lessons);
        }

    }
}
