using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetLessonsByCourse(int courseId)
    {
        var lessons = await _db.Lessons
            .Where(x => x.CourseId == courseId)
            .OrderBy(x => x.Order)
            .ToListAsync();

        return Ok(lessons);
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
        return Ok("Deleted");
    }
}
