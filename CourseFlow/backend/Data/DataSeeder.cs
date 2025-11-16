using System.Text.Json;
using CourseFlow.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.backend.Data
{
    public class DataSeeder
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DataSeeder(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task SeedCoursesAsync()
        {
            string filePath = Path.Combine(_env.ContentRootPath, "Data", "courses.json");
            if (!File.Exists(filePath))
                throw new FileNotFoundException("Courses JSON file not found!", filePath);

            var json = await File.ReadAllTextAsync(filePath);
            var courses = JsonSerializer.Deserialize<List<Course>>(json);

            if (courses == null || !courses.Any())
                return;

            foreach (var course in courses)
            {
                var existing = await _context.Courses
                    .FirstOrDefaultAsync(c => c.Title == course.Title);

                if (existing == null)
                {
                    _context.Courses.Add(course);
                }
                else
                {
                    // Optional: Update existing fields
                    existing.Category = course.Category;
                    existing.Rating = course.Rating;
                    existing.Students = course.Students;
                    existing.Duration = course.Duration;
                    existing.Price = course.Price;
                    existing.Level = course.Level;
                    existing.Image = course.Image;
                    existing.VideoUrl = course.VideoUrl;
                    existing.Description = course.Description;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
