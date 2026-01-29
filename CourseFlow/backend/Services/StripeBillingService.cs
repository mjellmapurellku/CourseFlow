using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace CourseFlow.backend.Services
{
    public class StripeBillingService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public StripeBillingService(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        public async Task<Session> CreateCheckoutSession(int userId,int courseId,int enrollmentId)
        {
            var options = new SessionCreateOptions
            {
                Mode = "payment",
                PaymentMethodTypes = new List<string> { "card" },

                LineItems = new List<SessionLineItemOptions>
        {
            new()
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    UnitAmount = 5000,
                    ProductData = new()
                    {
                        Name = $"Course #{courseId}"
                    }
                },
                Quantity = 1
            }
        },
                SuccessUrl = $"http://localhost:3000/success?session_id={{CHECKOUT_SESSION_ID}}&courseId={courseId}",
                CancelUrl = "http://localhost:3000/courses",

                Metadata = new Dictionary<string, string>
        {
            { "enrollmentId", enrollmentId.ToString() }
        }
            };

            var service = new SessionService();
            return await service.CreateAsync(options);
        }
    }
}
