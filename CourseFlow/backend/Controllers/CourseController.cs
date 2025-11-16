using Microsoft.AspNetCore.Mvc;
using CourseFlow.backend.Models;
using CourseFlow.backend.Services;
using CourseFlow.backend.Models.DTOs;

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
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
            => Ok(await _courseService.GetAllCourses());

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourseById(int id)
        {
            var course = await _courseService.GetCourseById(id);
            if (course == null) return NotFound();
            return Ok(course);
        }

        // CREATE COURSE
        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse([FromBody] CourseCreateDto dto)
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
            return Ok(created);
        }


        // UPDATE COURSE
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

            return Ok(existing);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var deleted = await _courseService.DeleteCourse(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // SAVE IMAGE
        private async Task<string> SaveImage(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath
                ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            return $"/uploads/{fileName}";
        }
    }
}
