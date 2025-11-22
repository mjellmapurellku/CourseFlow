using CourseFlow.backend.Models;

namespace CourseFlow.backend.Services
{
    public interface ILessonService
    {
        Task<Lesson> CreateLesson(Lesson lesson);
        Task<List<Lesson>> GetLessonsByCourse(int courseId);
        Task<Lesson> UpdateLesson(int id, Lesson updated);
        Task<bool> DeleteLesson(int id);
    }
}
