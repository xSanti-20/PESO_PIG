using API_PESO_PIG.Models;

namespace API_PESO_PIG.Services
{
    public class UserServices
    {
        private readonly AppDbContext _context;
        public UserServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<User> GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}