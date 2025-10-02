using CourseFlow.Models;
using CourseFlow.Repositories;
using Microsoft.Extensions.Logging;

namespace CourseFlow.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ILogger<EnrollmentService> _logger;

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ILogger<EnrollmentService> logger)
        {
            _enrollmentRepository = enrollmentRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Enrollment>> GetAllEnrollments()
        {
            _logger.LogInformation("Fetching all enrollments");
            return await _enrollmentRepository.GetAllAsync();
        }

        public async Task<Enrollment> GetEnrollmentById(int id)
        {
            _logger.LogInformation("Fetching enrollment with id {EnrollmentId}", id);
            return await _enrollmentRepository.GetByIdAsync(id);
        }

        public async Task<Enrollment> CreateEnrollment(Enrollment enrollment)
        {
            _logger.LogInformation("Creating new enrollment for UserId {UserId}, CourseId {CourseId}",
                enrollment.UserId, enrollment.CourseId);

            await _enrollmentRepository.AddAsync(enrollment);
            return enrollment;
        }

        public async Task<Enrollment> UpdateEnrollment(int id, Enrollment enrollment)
        {
            _logger.LogInformation("Updating enrollment with id {EnrollmentId}", id);

            var existing = await _enrollmentRepository.GetByIdAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("Enrollment with id {EnrollmentId} not found", id);
                return null;
            }

            existing.UserId = enrollment.UserId;
            existing.CourseId = enrollment.CourseId;
            existing.EnrollmentDate = enrollment.EnrollmentDate;

            await _enrollmentRepository.UpdateAsync(existing);

            _logger.LogInformation("Enrollment with id {EnrollmentId} updated successfully", id);

            return existing;
        }

        public async Task<bool> DeleteEnrollment(int id)
        {
            _logger.LogInformation("Deleting enrollment with id {EnrollmentId}", id);

            var existing = await _enrollmentRepository.GetByIdAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("Enrollment with id {EnrollmentId} not found", id);
                return false;
            }

            await _enrollmentRepository.DeleteAsync(existing);

            _logger.LogInformation("Enrollment with id {EnrollmentId} deleted successfully", id);
            return true;
        }
    }
}
