using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.EntityFrameworkCore;

public class RecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Course>> GetRecommendations(int userId)
    {
        // 1. Get completed courses
        var completedCourses = await _context.Enrollments
            .Where(e => e.UserId == userId && e.ProgressPercent == 100)
            .Select(e => e.Course)
            .ToListAsync();

        if (!completedCourses.Any())
        {
            // New user → recommend beginner courses they are NOT enrolled in
            return await _context.Courses
                .Where(c => c.Level == "Beginner"
                    && !_context.Enrollments.Any(e =>
                        e.UserId == userId && e.CourseId == c.Id))
                .Take(3)
                .ToListAsync();
        }

        // 2. Max level per category
        var maxLevels = completedCourses
            .GroupBy(c => c.Category)
            .Select(g => new
            {
                Category = g.Key,
                MaxLevel = g.Max(c =>
                    c.Level == "Beginner" ? 1 :
                    c.Level == "Intermediate" ? 2 : 3)
            })
            .ToList();

        // 3. Recommend next level & exclude enrolled
        var recommendations = await _context.Courses
            .Where(c =>
                maxLevels.Any(m =>
                    m.Category == c.Category &&
                    (
                        (m.MaxLevel == 1 && c.Level == "Intermediate") ||
                        (m.MaxLevel == 2 && c.Level == "Advanced")
                    )
                )
                && !_context.Enrollments.Any(e =>
                    e.UserId == userId && e.CourseId == c.Id)
            )
            .Take(3)
            .ToListAsync();

        return recommendations;
    }
}
