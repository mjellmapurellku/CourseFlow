using CourseFlow.Models;
using CourseFlow.Models.DTOs;

namespace CourseFlow.Services
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
    }
}
