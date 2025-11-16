using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using Microsoft.Win32.SafeHandles;

namespace CourseFlow.backend.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task AddAsync(User user);
        Task<User?> GetByEmailAsync(string email);
    }
}
