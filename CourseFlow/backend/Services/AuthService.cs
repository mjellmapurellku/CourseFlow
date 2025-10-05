using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Logging; // 🔹 shtohet kjo
using System.Security.Cryptography;
using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;

namespace CourseFlow.backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext context;
        private readonly IConfiguration configuration;
        private readonly ILogger<AuthService> _logger; // 🔹 logger field

        public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            this.context = context;
            this.configuration = configuration;
            _logger = logger;
        }

        private async Task<User?> ValidateRefreshTokenAsync(int userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                _logger.LogWarning("Invalid refresh token for UserId={UserId}", userId);
                return null;
            }
            _logger.LogInformation("Valid refresh token for UserId={UserId}", userId);
            return user;
        }

        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            _logger.LogInformation("Refresh token attempt for UserId={UserId}", request.Id);

            var user = await ValidateRefreshTokenAsync(request.Id, request.RefreshToken);
            if (user == null)
            {
                _logger.LogWarning("Refresh token failed for UserId={UserId}", request.Id);
                return null;
            }

            return await CreateTokenResponse(user);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber); // 🔹 mungonte kjo te versioni yt
            return Convert.ToBase64String(randomNumber);
        }

        public async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();

            _logger.LogInformation("Generated new refresh token for UserId={UserId}", user.Id);

            return refreshToken;
        }

        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            _logger.LogInformation("Login attempt for Email={Email}", request.Email);

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null)
            {
                _logger.LogWarning("Login failed: User not found for Email={Email}", request.Email);
                return null;
            }

            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                 == PasswordVerificationResult.Failed)
            {
                _logger.LogWarning("Login failed: Invalid password for Email={Email}", request.Email);
                return null;
            }

            _logger.LogInformation("Login successful for UserId={UserId}, Email={Email}", user.Id, user.Email);
            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }

        public async Task<User?> RegisterAsync(UserDto request)
        {
            _logger.LogInformation("Registration attempt for Email={Email}", request.Email);

            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                _logger.LogWarning("Registration failed: Email already exists {Email}", request.Email);
                return null;
            }

            var user = new User();
            var hashedPsw = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

            user.Email = request.Email;
            user.PasswordHash = hashedPsw;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            _logger.LogInformation("Registration successful for UserId={UserId}, Email={Email}", user.Id, user.Email);
            return user;
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            _logger.LogInformation("Generated JWT token for UserId={UserId}", user.Id);

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
