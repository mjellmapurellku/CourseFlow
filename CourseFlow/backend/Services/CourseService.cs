using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CourseFlow.backend.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CourseService> _logger;

        public CourseService(AppDbContext context, ILogger<CourseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Course>> GetAllCourses()
        {
            _logger.LogInformation("Fetching all courses from database");
            return await _context.Courses.ToListAsync();
        }

        public async Task<Course?> GetCourseById(int id)
        {
            _logger.LogInformation("Fetching course with id {CourseId}", id);

            return await _context.Courses
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == id);
        }


        public async Task<Course> CreateCourse(Course course)
        {
            _logger.LogInformation("Creating a new course: {Title}", course.Title);
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateCourse(int id, Course course)
        {
            _logger.LogInformation("Updating course with id {CourseId}", id);

            var existing = await _context.Courses.FindAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("Course with id {CourseId} not found", id);
                return null;
            }

            existing.Level = course.Level;
            existing.Title = course.Title;
            existing.Description = course.Description;
            existing.Category = course.Category;
            existing.Instructor = course.Instructor;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Course with id {CourseId} updated successfully", id);

            return existing;
        }

        public async Task<bool> DeleteCourse(int id)
        {
            _logger.LogInformation("Deleting course with id {CourseId}", id);

            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                _logger.LogWarning("Course with id {CourseId} not found for deletion", id);
                return false;
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Course with id {CourseId} deleted successfully", id);
            return true;
        }
    }
}
