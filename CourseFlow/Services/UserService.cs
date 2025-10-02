using CourseFlow.Models;
using CourseFlow.Repositories;
using Microsoft.Extensions.Logging;

namespace CourseFlow.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            _logger.LogInformation("Fetching all users...");
            var users = await _userRepository.GetAllAsync();
            _logger.LogInformation("Fetched {Count} users", users.Count());
            return users;
        }

        public async Task<User> GetUserById(int id)
        {
            _logger.LogInformation("Fetching user with Id = {Id}", id);
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
                _logger.LogWarning("User with Id = {Id} not found", id);
            else
                _logger.LogInformation("User with Id = {Id} found", id);

            return user;
        }

        public async Task<User> CreateUser(User user)
        {
            _logger.LogInformation("Creating new user with Email = {Email}", user.Email);
            await _userRepository.AddAsync(user);
            _logger.LogInformation("User with Id = {Id} created successfully", user.Id);
            return user;
        }

        public async Task<User> UpdateUser(int id, User user)
        {
            _logger.LogInformation("Updating user with Id = {Id}", id);

            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("User with Id = {Id} not found for update", id);
                return null;
            }

            existing.FullName = user.FullName;
            existing.Email = user.Email;
            existing.PasswordHash = user.PasswordHash;

            await _userRepository.UpdateAsync(existing);
            _logger.LogInformation("User with Id = {Id} updated successfully", id);
            return existing;
        }

        public async Task<bool> DeleteUser(int id)
        {
            _logger.LogInformation("Deleting user with Id = {Id}", id);

            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("User with Id = {Id} not found for deletion", id);
                return false;
            }

            await _userRepository.DeleteAsync(existing);
            _logger.LogInformation("User with Id = {Id} deleted successfully", id);
            return true;
        }
    }
}
