using CourseFlow.Data;
using CourseFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.Repositories
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        private readonly AppDbContext _context;

        public CourseRepository(AppDbContext context) : base(context) 
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetByCategoryAsync(string category)
        {
            return await _context.Courses
                .Where(c => c.Category == category)
                .ToListAsync();
        }

        public async Task<IEnumerable<Course>> GetByInstructorIdAsync(int instructorId)
        {
            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .ToListAsync();
        }
    }
}
