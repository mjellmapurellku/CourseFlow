using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly StripeBillingService _stripeBillingService;

    public EnrollmentController(IEnrollmentService enrollmentService,StripeBillingService stripeBillingService)
    {
        _enrollmentService = enrollmentService;
        _stripeBillingService = stripeBillingService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments()
        => Ok(await _enrollmentService.GetAllEnrollments());

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Enrollment>>> GetByUser(int userId)
    {
        var items = await _enrollmentService.GetByUserIdAsync(userId);
        return Ok(items);
    }

    [Authorize]
    [HttpGet("status")]
    public async Task<ActionResult> GetStatus([FromQuery] int courseId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var enrollment = await _enrollmentService
            .GetByUserAndCourseAsync(userId, courseId);

        if (enrollment == null || !enrollment.IsPaid)
            return Forbid("Course not purchased");

        return Ok(new
        {
            enrollment.Id,
            enrollment.CourseId,
            enrollment.EnrollmentDate,
            enrollment.ProgressPercent,
            enrollment.CompletedLessons
        });
    }

    [Authorize]
    [HttpPost("start-payment")]
    public async Task<IActionResult> StartPayment([FromBody] CheckoutRequestDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        if (await _enrollmentService.ExistsAsync(userId, dto.CourseId))
            return Conflict("Already enrolled");

        var session = await _stripeBillingService.CreateCheckoutSession(
            userId,
            dto.CourseId,
            dto.Email
        );

        return Ok(new { url = session.Url });
    }

    [Authorize]
    [HttpPost("complete-lesson")]
    public async Task<IActionResult> CompleteLesson([FromQuery] int courseId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var enrollment = await _enrollmentService
            .GetByUserAndCourseAsync(userId, courseId);

        if (enrollment == null || !enrollment.IsPaid)
            return Forbid("Course not purchased");

        var totalLessons = enrollment.Course.Lessons.Count;

        if (enrollment.CompletedLessons < totalLessons)
        {
            enrollment.CompletedLessons++;
            enrollment.ProgressPercent =
                (int)((double)enrollment.CompletedLessons / totalLessons * 100);

            await _enrollmentService.UpdateEnrollment(
                enrollment.Id,
                enrollment
            );
        }

        return Ok(new
        {
            enrollment.CompletedLessons,
            enrollment.ProgressPercent
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEnrollment(int id,[FromBody] Enrollment updated)
    {
        var result = await _enrollmentService
            .UpdateEnrollment(id, updated);

        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        var deleted = await _enrollmentService.DeleteEnrollment(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
