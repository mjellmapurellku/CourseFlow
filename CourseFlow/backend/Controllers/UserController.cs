using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseFlow.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly AppDbContext _db;

        public UserController(IUserService userService, AppDbContext db)
        {
            _userService = userService;
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
            => Ok(await _userService.GetAllUsers());

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(UserDto user)
             => Ok(await _userService.CreateUser(user));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto user)
        {
            var updated = await _userService.UpdateUser(id, user);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUser(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
        [HttpPost("start-trial/{userId}")]
        public async Task<IActionResult> StartTrial(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (user.IsTrialActive)
                return BadRequest("Trial already active");

            user.TrialStart = DateTime.UtcNow;
            user.TrialEnd = DateTime.UtcNow.AddDays(7);
            user.IsTrialActive = true;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Trial started",
                user.TrialStart,
                user.TrialEnd
            });
        }

        [HttpGet("trial-status/{userId}")]
        public async Task<IActionResult> TrialStatus(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound();

            bool expired = user.IsTrialActive && user.TrialEnd < DateTime.UtcNow;

            if (expired)
                user.IsTrialActive = false;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                isActive = user.IsTrialActive,
                expired,
                user.TrialStart,
                user.TrialEnd
            });
        }
    }
}

