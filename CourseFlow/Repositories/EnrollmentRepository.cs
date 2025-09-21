using CourseFlow.Data;
using CourseFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {

        private readonly AppDbContext _context;

        public EnrollmentRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Enrollment>> GetAllSync()
            => await _context.Enrollments.ToListAsync();

        public async Task<Enrollment> GetByIdSync(int id)
            => await _context.Enrollments.FindAsync(id);

        public async Task AddAsync(Enrollment enrollment)
        {
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Enrollment enrollment)
        {
            _context.Enrollments.Update(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);

            if (enrollment != null)
            {
                _context.Enrollments.Remove(enrollment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
