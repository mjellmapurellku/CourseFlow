using CourseFlow.backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace CourseFlow.backend.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<Course>> GetAllCourses();
        Task<Course?> GetCourseById(int id);
        Task<Course> CreateCourse(Course course);
        Task<Course?> UpdateCourse(int id, Course course);
        Task<bool> DeleteCourse(int id);
    }
}
