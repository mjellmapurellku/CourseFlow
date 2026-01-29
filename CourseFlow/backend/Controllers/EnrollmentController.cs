using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly StripeBillingService _stripeBillingService;
    private readonly AppDbContext _db;

    [Authorize]
    [HttpGet("auth-test")]
    public IActionResult AuthTest()
    {
        return Ok(new
        {
            IsAuthenticated = User.Identity!.IsAuthenticated,
            Claims = User.Claims.Select(c => new { c.Type, c.Value })
        });
    }

    public EnrollmentController(IEnrollmentService enrollmentService,StripeBillingService stripeBillingService, AppDbContext db)
    {
        _enrollmentService = enrollmentService;
        _stripeBillingService = stripeBillingService;
        _db = db;
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
    public async Task<IActionResult> StartPayment([FromBody] CheckoutRequestDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var existing = await _enrollmentService
            .GetByUserAndCourseAsync(userId, dto.CourseId);

        if (existing != null)
        {
            if (existing.IsPaid)
                return Conflict("Already paid");

            var checkoutSession = await _stripeBillingService
                .CreateCheckoutSession(userId, dto.CourseId, existing.Id);

            existing.StripeSessionId = checkoutSession.Id;
            await _enrollmentService.UpdateEnrollment(existing.Id, existing);

            return Ok(new { url = checkoutSession.Url });
        }

        var enrollment = await _enrollmentService.CreateEnrollment(new Enrollment
        {
            UserId = userId,
            CourseId = dto.CourseId,
            IsPaid = false,
            EnrollmentDate = DateTime.UtcNow,
            ProgressPercent = 0,
            CompletedLessons = 0
        });

        var checkoutSessionNew = await _stripeBillingService
            .CreateCheckoutSession(userId, dto.CourseId, enrollment.Id);

        enrollment.StripeSessionId = checkoutSessionNew.Id;
        await _enrollmentService.UpdateEnrollment(enrollment.Id, enrollment);

        return Ok(new { url = checkoutSessionNew.Url });
    }

    [Authorize]
    [HttpPost("confirm-payment")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var service = new Stripe.Checkout.SessionService();
        var session = await service.GetAsync(dto.SessionId);

        if (session.PaymentStatus != "paid")
            return BadRequest("Payment not completed");

        if (!session.Metadata.TryGetValue("enrollmentId", out var enrollmentIdStr))
            return BadRequest("Missing enrollmentId");

        var enrollmentId = int.Parse(enrollmentIdStr);

        var enrollment = await _enrollmentService.GetEnrollmentById(enrollmentId);

        if (enrollment == null || enrollment.UserId != userId)
            return Forbid();

        if (!enrollment.IsPaid)
        {
            enrollment.IsPaid = true;
            await _enrollmentService.UpdateEnrollment(enrollment.Id, enrollment);
        }

        return Ok(new { courseId = enrollment.CourseId });
    }

    [Authorize]
    [HttpPost("complete-lesson")]
    public async Task<IActionResult> CompleteLesson([FromQuery] int courseId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var enrollment = await _db.Enrollments
            .Include(e => e.Course)
            .ThenInclude(c => c.Lessons)
            .FirstOrDefaultAsync(e =>
                e.UserId == userId &&
                e.CourseId == courseId &&
                e.IsPaid
            );

        if (enrollment == null)
            return Forbid();

        var totalLessons = enrollment.Course.Lessons.Count;

        if (enrollment.CompletedLessons < totalLessons)
        {
            enrollment.CompletedLessons++;
            enrollment.ProgressPercent =
                (int)((double)enrollment.CompletedLessons / totalLessons * 100);

            await _db.SaveChangesAsync();
        }

        return Ok(new
        {
            enrollment.CompletedLessons,
            enrollment.ProgressPercent
        });
    }
}

