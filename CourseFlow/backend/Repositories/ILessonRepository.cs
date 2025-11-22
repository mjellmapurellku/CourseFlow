using CourseFlow.backend.Models;

namespace CourseFlow.backend.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson> CreateLesson(Lesson lesson);
        Task<List<Lesson>> GetLessonsByCourse(int courseId);
        Task<Lesson> GetById(int id);
        Task<Lesson> UpdateLesson(Lesson lesson);
        Task<bool> DeleteLesson(int id);

    }
}
