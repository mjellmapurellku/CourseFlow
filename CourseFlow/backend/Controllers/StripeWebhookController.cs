using CourseFlow.backend.Data;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

[ApiController]
[Route("api/stripe/webhook")]
public class StripeWebhookController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public StripeWebhookController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> Handle()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signatureHeader = Request.Headers["Stripe-Signature"];

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                signatureHeader,
                _config["Stripe:WebhookSecret"]
            );
        }
        catch
        {
            return BadRequest();
        }

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;

            var enrollment = _context.Enrollments
                .FirstOrDefault(e => e.StripeSessionId == session.Id);

            if (enrollment != null)
            {
                enrollment.IsPaid = true;
                enrollment.EnrollmentDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        return Ok();
    }
}
