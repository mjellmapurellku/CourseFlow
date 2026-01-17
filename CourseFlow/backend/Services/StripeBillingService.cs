using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Stripe.Checkout;
using Stripe;

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

        public async Task<Session> CreateCheckoutSession(
            int userId,
            int courseId,
            string email)
        {
            var priceId = _config["Stripe:PriceId"];

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = "https://yourfrontend.com/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "https://yourfrontend.com/cancel",
                CustomerEmail = email,

                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1
                    }
                },

                Metadata = new Dictionary<string, string>
                {
                    { "userId", userId.ToString() },
                    { "courseId", courseId.ToString() }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            _context.Enrollments.Add(new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                StripeSessionId = session.Id,
                IsPaid = false
            });

            await _context.SaveChangesAsync();

            return session;
        }
    }
}
