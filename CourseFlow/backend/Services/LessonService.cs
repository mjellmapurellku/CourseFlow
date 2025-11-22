using CourseFlow.backend.Models;
using CourseFlow.backend.Repositories;

namespace CourseFlow.backend.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _repo;

        public LessonService(ILessonRepository repo)
        {
            _repo = repo;
        }

        public async Task<Lesson> CreateLesson(Lesson lesson)
        {
            return await _repo.CreateLesson(lesson);
        }

        public async Task<List<Lesson>> GetLessonsByCourse(int courseId)
        {
            return await _repo.GetLessonsByCourse(courseId);
        }

        public async Task<Lesson> UpdateLesson(int id, Lesson updated)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return null;

            existing.Title = updated.Title;
            existing.Description = updated.Description;
            existing.VideoUrl = updated.VideoUrl;
            existing.Order = updated.Order;

            return await _repo.UpdateLesson(existing);
        }

        public async Task<bool> DeleteLesson(int id)
        {
            return await _repo.DeleteLesson(id);
        }
    }
  }
