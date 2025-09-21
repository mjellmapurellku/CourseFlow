using CourseFlow.Models;
using CourseFlow.Repositories;

namespace CourseFlow.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }
        public async Task<IEnumerable<Enrollment>> GetAllEnrollments()
          => await _enrollmentRepository.GetAllSync();

        public async Task<Enrollment> GetEnrollmentById(int id)
            => await _enrollmentRepository.GetByIdSync(id);

        public async Task<Enrollment> CreateEnrollment(Enrollment enrollment)
        {
            await _enrollmentRepository.AddAsync(enrollment);
            return enrollment;
        }

        public async Task<Enrollment> UpdateEnrollment(int id, Enrollment enrollment)
        {
            var existing = await _enrollmentRepository.GetByIdSync(id);
            if (existing == null) return null;

            existing.UserId = enrollment.UserId;
            existing.CourseId = enrollment.CourseId;
            existing.EnrollmentDate = enrollment.EnrollmentDate;

            await _enrollmentRepository.UpdateAsync(existing);
            return existing;
        }


        public async Task<bool> DeleteEnrollment(int id)
        {
            var existing = await _enrollmentRepository.GetByIdSync(id);
            if (existing == null) return false;

            await _enrollmentRepository.DeleteAsync(id);
            return true;
        }
    }
}
