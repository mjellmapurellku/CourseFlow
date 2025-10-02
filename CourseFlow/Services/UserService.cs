using CourseFlow.Models;
using CourseFlow.Repositories;

namespace CourseFlow.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
            => await _userRepository.GetAllAsync();

        public async Task<User> GetUserById(int id)
            => await _userRepository.GetByIdAsync(id);

        public async Task<User> CreateUser(User user)
        {
            await _userRepository.AddAsync(user);
            return user;
        }

        public async Task<User> UpdateUser(int id, User user)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.FullName = user.FullName;
            existing.Email = user.Email;
            existing.PasswordHash = user.PasswordHash;

            await _userRepository.UpdateAsync(user);
            return existing;
        }

        public async Task<bool> DeleteUser(int id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await _userRepository.DeleteAsync(existing);  
            return true;
        }
    }
}
