using CourseFlow.backend.Services;
using Microsoft.AspNetCore.Mvc;
using CourseFlow.backend.Models.DTOs;

[Route("api/[controller]")]
[ApiController]
public class BillingController : ControllerBase
{
    private readonly StripeBillingService _stripeService;

    public BillingController(StripeBillingService stripeService)
    {
        _stripeService = stripeService;
    }

    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] CheckoutRequestDto request)
    {
        if (request == null || string.IsNullOrEmpty(request.Email))
            return BadRequest("Invalid request");

        var session = await _stripeService.CreateCheckoutSession(
            request.UserId,
            request.CourseId,
            request.Email
        );

        return Ok(new { url = session.Url });
    }
}

