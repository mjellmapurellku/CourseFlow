using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class LessonController : ControllerBase
{
    private readonly AppDbContext _db;

    public LessonController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLesson([FromBody] Lesson dto)
    {
        _db.Lessons.Add(dto);
        await _db.SaveChangesAsync();
        return Ok(dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] Lesson updated)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return NotFound();

        lesson.Title = updated.Title;
        lesson.Description = updated.Description;
        lesson.VideoUrl = updated.VideoUrl;
        lesson.Order = updated.Order;

        await _db.SaveChangesAsync();
        return Ok(lesson);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return NotFound();

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetLessonPreview(int courseId)
    {
        var lessons = await _db.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .Select(l => new
            {
                l.Id,
                l.Title,
                l.Order
            })
            .ToListAsync();

        return Ok(lessons);
    }

    [Authorize]
    [HttpGet("course/{courseId}/paid")]
    public async Task<IActionResult> GetPaidLessons(int courseId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var enrollment = await _db.Enrollments
            .FirstOrDefaultAsync(e =>
                e.CourseId == courseId &&
                e.UserId == userId &&
                e.IsPaid);

        if (enrollment == null)
            return Forbid("You must purchase this course.");

        var lessons = await _db.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .Select(l => new
            {
                l.Id,
                l.Title,
                l.Description,
                l.VideoUrl,
                l.Order
            })
            .ToListAsync();

        return Ok(lessons);
    }

}
