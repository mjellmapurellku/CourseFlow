using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CourseFlow.backend.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ILogger<EnrollmentService> _logger;
        private readonly AppDbContext _db;   // <-- FIELD

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ILogger<EnrollmentService> logger,
            AppDbContext db)                  // <-- INJECT HERE
        {
            _enrollmentRepository = enrollmentRepository;
            _logger = logger;
            _db = db;                         // <-- ASSIGN HERE
        }

        public async Task<IEnumerable<Enrollment>> GetAllEnrollments()
        {
            _logger.LogInformation("Fetching all enrollments");
            return await _enrollmentRepository.GetAllAsync();
        }

        public async Task<Enrollment> GetEnrollmentById(int id)
        {
            return await _enrollmentRepository.GetByIdAsync(id);
        }

        public async Task<Enrollment> CreateEnrollment(Enrollment enrollment)
        {
            await _enrollmentRepository.AddAsync(enrollment);
            return enrollment;
        }

        public async Task<Enrollment> UpdateEnrollment(int id, Enrollment enrollment)
        {
            var existing = await _enrollmentRepository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.IsPaid = enrollment.IsPaid;
            existing.StripeSessionId = enrollment.StripeSessionId;
            existing.ProgressPercent = enrollment.ProgressPercent;
            existing.CompletedLessons = enrollment.CompletedLessons;

            await _enrollmentRepository.UpdateAsync(existing);
            return existing;
        }
        public async Task<bool> DeleteEnrollment(int id)
        {
            var existing = await _enrollmentRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await _enrollmentRepository.DeleteAsync(existing);
            return true;
        }

        public async Task<bool> ExistsAsync(int userId, int courseId)
        {
            var enrollments = await _enrollmentRepository.GetByUserIdAsync(userId);
            return enrollments.Any(e => e.CourseId == courseId);
        }

        public async Task<IEnumerable<Enrollment>> GetByUserIdAsync(int userId)
        {
            return await _enrollmentRepository.GetByUserIdAsync(userId);
        }

        public async Task<Enrollment?> GetByUserAndCourseAsync(int userId, int courseId)
        {
            var list = await _enrollmentRepository.GetByUserIdAsync(userId);
            return list.FirstOrDefault(e => e.CourseId == courseId);
        }

        public async Task<Enrollment?> UpdateProgress(int userId, int courseId, int percent)
        {
            var enrollment = await _db.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment == null)
                return null;

            enrollment.ProgressPercent = percent;
            await _db.SaveChangesAsync();

            return enrollment;
        }
    }
}
