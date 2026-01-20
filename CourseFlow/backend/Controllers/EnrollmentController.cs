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

    public EnrollmentController(
        IEnrollmentService enrollmentService,
        StripeBillingService stripeBillingService)
    {
        _enrollmentService = enrollmentService;
        _stripeBillingService = stripeBillingService;
    }

    [Authorize]
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus([FromQuery] int courseId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var enrollment =
            await _enrollmentService.GetByUserAndCourseAsync(userId, courseId);

        if (enrollment == null || !enrollment.IsPaid)
        {
            return Ok(new { isEnrolled = false });
        }

        return Ok(new { isEnrolled = true });

    }

    [Authorize]
    [HttpPost("start-payment")]
    public async Task<IActionResult> StartPayment(
        [FromBody] CheckoutRequestDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        if (await _enrollmentService.ExistsAsync(userId, dto.CourseId))
            return Conflict("Already enrolled");

        var session =
            await _stripeBillingService.CreateCheckoutSession(
                userId,
                dto.CourseId
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

        var enrollment =
            await _enrollmentService.GetByUserAndCourseAsync(userId, courseId);

        if (enrollment == null || !enrollment.IsPaid)
            return Forbid();

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
}
