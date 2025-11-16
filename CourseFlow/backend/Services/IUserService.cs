using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;

namespace CourseFlow.backend.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task<User> CreateUser(UserDto user);
        Task<User> UpdateUser(int id, UpdateUserDto user);
        Task<bool> DeleteUser(int id);
    }
}
