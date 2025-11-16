using CourseFlow.backend.Enums;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Repositories;
using Org.BouncyCastle.Crypto.Generators;
using BC = BCrypt.Net.BCrypt;


namespace CourseFlow.backend.Services
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

        public async Task<User> CreateUser(UserDto userDto)
        {
            _logger.LogInformation("Creating new user with Email = {Email}", userDto.Email);

            // Try to parse Role from DTO; fallback to Student
            UserRoles role = UserRoles.Student;
            if (!string.IsNullOrEmpty(userDto.Role))
            {
                if (!Enum.TryParse(userDto.Role, true, out role))
                {
                    _logger.LogWarning("Invalid role '{Role}' provided. Defaulting to Student.", userDto.Role);
                    role = UserRoles.Student;
                }
            }

            var user = new User
            {
                FullName = userDto.FullName,
                Email = userDto.Email,
                Username = userDto.Username,
                PasswordHash = BC.HashPassword(userDto.Password),
                Role = role
            };

            await _userRepository.AddAsync(user);
            _logger.LogInformation("User with Id = {Id} created successfully", user.Id);

            return user;
        }
        public async Task<User?> UpdateUser(int id, UpdateUserDto dto)
        {
            _logger.LogInformation("Updating user with Id = {Id}", id);

            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
            {
                _logger.LogWarning("User with Id = {Id} not found for update", id);
                return null;
            }

            existing.FullName = dto.FullName;
            existing.Email = dto.Email;
            existing.Username = dto.Username;

            if (Enum.TryParse<UserRoles>(dto.Role, true, out var parsedRole))
            {
                existing.Role = parsedRole;
            }
            else
            {
                _logger.LogWarning("Invalid role '{Role}' provided for user {Id}", dto.Role, id);
            }

            if (!string.IsNullOrEmpty(dto.PasswordHash))
            {
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);
            }

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
