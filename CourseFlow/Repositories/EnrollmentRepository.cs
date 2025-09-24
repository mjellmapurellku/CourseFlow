using CourseFlow.Data;
using CourseFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.Repositories
{
    public class EnrollmentRepository : Repository<Enrollment>, IEnrollmentRepository
    {

        private readonly AppDbContext _context;

        public EnrollmentRepository(AppDbContext context) : base(context) 
        {
            _context = context;
        }

        public async Task<IEnumerable<Enrollment>> GetByUserIdAsync(int userId)
        {
            return await _context.Enrollments
                .Where(e => e.UserId == userId)
                .Include(e => e.Course)
                .ToListAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetByCourseIdAsync(int courseId)
        {
            return await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Include(e => e.User)
                .ToListAsync();
        }

    }
}
