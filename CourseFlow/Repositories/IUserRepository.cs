using CourseFlow.Models;
using Microsoft.Win32.SafeHandles;

namespace CourseFlow.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllSync();
        Task<User> GetByIdSync(int  id);    
        Task AddAsync(User user);
        Task UpdateAsync (User user);
        Task DeleteAsync(int id);
    }
}
