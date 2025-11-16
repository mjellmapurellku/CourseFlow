using CourseFlow.backend.Data;
using CourseFlow.backend.Enums;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CourseFlow.backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext context;
        private readonly IConfiguration configuration;
        private readonly ILogger<AuthService> logger;

        public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            this.context = context;
            this.configuration = configuration;
            this.logger = logger;
        }

        public async Task<User?> RegisterAsync(UserDto request, UserRoles role = UserRoles.Student)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
                return null;

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Username = request.Username ?? request.Email,
                Role = role
            }; 

            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, request.Password);

            context.Users.Add(user);
            await context.SaveChangesAsync();
            return user;
        }

        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            logger.LogInformation($"Login attempt for email: {request.Email}");

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                logger.LogWarning($"User not found with email: {request.Email}");
                return null;
            }

            logger.LogInformation($"User found: {user.Email}, Role: {user.Role}");

            var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                logger.LogWarning($"Password verification failed for user: {request.Email}");
                return null;
            }

            logger.LogInformation($"Login successful for user: {request.Email}");
            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            var token = CreateToken(user);
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(user);

            return new TokenResponseDto
            {
                AccessToken = token,
                RefreshToken = refreshToken
            };
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString("G")),
                new Claim("role", user.Role.ToString("G")) // ✅ extra fallback claim
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["AppSettings:Token"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: configuration["AppSettings:Issuer"],
                audience: configuration["AppSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            user.RefreshToken = token;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return token;
        }

        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var user = await context.Users.FindAsync(request.Id);
            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            return await CreateTokenResponse(user);
        }
    }
}
