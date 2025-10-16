using CourseFlow.backend.Enums;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;

namespace CourseFlow.backend.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request, UserRoles role = UserRoles.Student);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
    }
}
