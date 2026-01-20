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

        public async Task<Session> CreateCheckoutSession(int userId, int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                throw new Exception("Course not found");

            if (string.IsNullOrEmpty(course.StripePriceId))
                throw new Exception("Stripe price not configured for this course");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                CustomerEmail = user.Email,
                SuccessUrl = "https://yourfrontend.com/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "https://yourfrontend.com/cancel",

                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = course.StripePriceId,
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
