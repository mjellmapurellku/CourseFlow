using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using CourseFlow.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;

    public ChatController(IConfiguration config, AppDbContext db)
    {
        _config = config;
        _db = db;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request?.Messages == null || request.Messages.Count == 0)
            return BadRequest("Messages array is empty");

        // ✅ Get logged-in user ID
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        // ✅ Get completed courses (100%)
        var completedCourses = await _db.Enrollments
            .Include(e => e.Course)
            .Where(e =>
                e.UserId == userId &&
                e.IsPaid &&
                e.ProgressPercent == 100
            )
            .Select(e => e.Course.Title)
            .ToListAsync();

        using var http = new HttpClient();

        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _config["Groq:ApiKey"]);

        // ✅ System message with rules + completed courses
        var systemMessage = new MessageDto
        {
            Role = "system",
            Content = $@"
You are a CourseFlow AI assistant.

Available courses:
1. AI for Beginners | Category: AI | Level: Beginner
2. React from Zero to Hero | Category: Programming | Level: Intermediate
3. UI/UX Design Essentials | Category: Design | Level: Beginner
4. Machine Learning 101 | Category: AI | Level: Advanced
5. Marketing Mastery | Category: Marketing | Level: Intermediate
6. Business Strategy | Category: Business | Level: Intermediate
7. Deep Learning Fundamentals | Category: AI | Level: Advanced
8. Python Programming Masterclass | Category: Programming | Level: Beginner
9. Data Science with Python | Category: Data Science | Level: Intermediate
10. Advanced JavaScript | Category: Programming | Level: Advanced
11. Graphic Design Fundamentals | Category: Design | Level: Beginner
12. Digital Marketing Strategy | Category: Marketing | Level: Intermediate

The user has already completed these courses:
{(completedCourses.Any() ? string.Join(", ", completedCourses) : "None")}

Rules:
- DO NOT ask the user what they have completed.
- DO NOT recommend completed or enrolled courses.
- Recommend logical next-step courses.
- Recommend ONLY from the available list.
- Keep responses concise.
"
        };

        var messages = new List<MessageDto> { systemMessage };
        messages.AddRange(request.Messages);

        var payload = new
        {
            model = "llama-3.1-8b-instant",
            messages
        };

        var response = await http.PostAsync(
            "https://api.groq.com/openai/v1/chat/completions",
            new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            )
        );

        var json = await response.Content.ReadAsStringAsync();
        return Content(json, "application/json");
    }
}
