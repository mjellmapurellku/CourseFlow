using CourseFlow.backend.Models;
using Microsoft.Win32.SafeHandles;

namespace CourseFlow.backend.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
