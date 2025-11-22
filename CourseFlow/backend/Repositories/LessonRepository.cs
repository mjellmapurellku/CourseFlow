using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Repositories;
using Microsoft.EntityFrameworkCore;

public class LessonRepository : ILessonRepository
{
    private readonly AppDbContext _db;

    public LessonRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Lesson> CreateLesson(Lesson lesson)
    {
        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();
        return lesson;
    }

    public async Task<List<Lesson>> GetLessonsByCourse(int courseId)
    {
        return await _db.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .ToListAsync();
    }

    public async Task<Lesson> GetById(int id)
    {
        return await _db.Lessons.FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<Lesson> UpdateLesson(Lesson lesson)
    {
        _db.Lessons.Update(lesson);
        await _db.SaveChangesAsync();
        return lesson;
    }

    public async Task<bool> DeleteLesson(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return false;

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
        return true;
    }
}
