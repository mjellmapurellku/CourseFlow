using CourseFlow.backend.Models;
using CourseFlow.backend.Services;
using CourseFlow.backend.Data;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CourseFlow.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
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

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(Course course)
            => Ok(await _courseService.CreateCourse(course));

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCourse(int id, Course course)
        {
            var updated = await _courseService.UpdateCourse(id, course);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var deleted = await _courseService.DeleteCourse(id);
            if (deleted == null) return NotFound();
            return NoContent();
        }
    }
}
