using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace CourseFlow.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillingController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BillingController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession()
        {
            var priceId = _config["Stripe:PriceId"];

            var options = new SessionCreateOptions
            {
                Mode = "subscription",
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1
                    }
                },
                SuccessUrl = "http://localhost:3000/payment-success",
                CancelUrl = "http://localhost:3000/payment-cancel"
            };

            var service = new SessionService();
            var session = service.Create(options);

            return Ok(new { url = session.Url });
        }
    }
}
