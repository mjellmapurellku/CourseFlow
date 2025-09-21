using CourseFlow.Data;
using CourseFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllCourses()
        {
            return await _context.Courses.ToListAsync();
        }

        public async Task<Course?> GetCourseById(int id)
        {
            return await _context.Courses.FindAsync(id);
        }

        public async Task<Course> CreateCourse(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateCourse(int id, Course course)
        {
            var existing =await _context.Courses.FindAsync(id);
            if (existing != null) return null; 

            existing.Level = course.Level;
            existing.Title = course.Title;
            existing.Description = course.Description;
            existing.Category = course.Category;
            existing.Instructor = course.Instructor;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;
            
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
