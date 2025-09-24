using CourseFlow.Data;
using CourseFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {

        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context) 
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

    }
}
