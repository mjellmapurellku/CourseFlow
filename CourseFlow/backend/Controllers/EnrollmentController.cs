using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    // GET: api/enrollment
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments()
        => Ok(await _enrollmentService.GetAllEnrollments());

    // GET: api/enrollment/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Enrollment>>> GetByUser(int userId)
    {
        var items = await _enrollmentService.GetByUserIdAsync(userId);
        return Ok(items);
    }

    // GET: api/enrollment/status?userId=1&courseId=2
    [HttpGet("status")]
    public async Task<ActionResult> GetStatus([FromQuery] int userId, [FromQuery] int courseId)
    {
        var enrollment = await _enrollmentService.GetByUserAndCourseAsync(userId, courseId);
        if (enrollment == null) return NotFound();
        return Ok(new
        {
            enrollment.Id,
            enrollment.UserId,
            enrollment.CourseId,
            enrollment.EnrollmentDate,
            enrollment.ProgressPercent,
            Course = new
            {
                enrollment.Course.Id,
                enrollment.Course.Title,
                enrollment.Course.Image,
                enrollment.Course.VideoUrl
            }
        });
    }

    // POST: api/enrollment
    [HttpPost]
    public async Task<ActionResult<Enrollment>> CreateEnrollment([FromBody] EnrollmentDto dto)
    {
        if (dto == null) return BadRequest();

        // check existing
        if (await _enrollmentService.ExistsAsync(dto.UserId, dto.CourseId))
            return Conflict(new { message = "User is already enrolled in this course." });

        var enrollment = new Enrollment
        {
            UserId = dto.UserId,
            CourseId = dto.CourseId,
            EnrollmentDate = DateTime.UtcNow,
            ProgressPercent = dto.ProgressPercent 
        };

        var created = await _enrollmentService.CreateEnrollment(enrollment);

        // return created with small payload
        return CreatedAtAction(nameof(GetStatus), new { userId = created.UserId, courseId = created.CourseId }, created);
    }

    // PUT: api/enrollment/{id} — update (e.g., progress)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] Enrollment updated)
    {
        var result = await _enrollmentService.UpdateEnrollment(id, updated);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // DELETE: api/enrollment/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        var deleted = await _enrollmentService.DeleteEnrollment(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
