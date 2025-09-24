using CourseFlow.Models;
using Microsoft.Win32.SafeHandles;

namespace CourseFlow.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
