using CourseFlow.backend.Data;
using CourseFlow.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseFlow.backend.Repositories
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
