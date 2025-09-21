//using CourseFlow.Models;
//using CourseFlow.Services;
//using Microsoft.AspNetCore.Mvc;

//namespace CourseFlow.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class EnrollmentController : ControllerBase
//    {
//        private readonly IEnrollmentService _enrollmentService;

//        public EnrollmentController(IEnrollmentService enrollmentService)
//        {
//            _enrollmentService = enrollmentService;
//        }

//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments()
//            => Ok(await _enrollmentService.GetAllEnrollments());

//        [HttpGet("{id}")]
//        public async Task<ActionResult<Enrollment>> GetEnrollment(int id)
//        {
//            var enrollment = await _enrollmentService.GetEnrollmentById(id);
//            if (enrollment == null) return NotFound();
//            return Ok(enrollment);
//        }

//        [HttpPost]
//        public async Task<ActionResult<Enrollment>> CreateEnrollment(Enrollment enrollment)
//        {
//            var created = await _enrollmentService.CreateEnrollment(enrollment);
//            return CreatedAtAction(nameof(GetEnrollment), new { id = created.Id }, created);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateEnrollment(int id, Enrollment enrollment)
//        {
//            var updated = await _enrollmentService.UpdateEnrollment(id, enrollment);
//            if (updated == null) return NotFound();
//            return Ok(updated);
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteEnrollment(int id)
//        {
//            var deleted = await _enrollmentService.DeleteEnrollment(id);
//            if (!deleted) return NotFound();
//            return NoContent();
//        }
//    }
//}
