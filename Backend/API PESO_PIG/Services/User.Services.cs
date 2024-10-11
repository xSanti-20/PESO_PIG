using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

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
        public async Task<User> GetUserEmail(string email)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<User> GetUserId(int id_Users)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(x => x.id_Users == id_Users);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public void Add(User entity)
        {
            _context.Users.Add(entity);
            _context.SaveChanges();
        }
        public async Task<bool> DelUsers(int id_Users)
        {
            try
            {
                var user = await _context.Users.FindAsync(id_Users);
                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<bool> UpdateUser(int id_Users, User updatedUser)
        {
            try
            {
                if (id_Users != updatedUser.id_Users)
                {
                    throw new ArgumentException("El ID del usuario no coincide.");
                }
                var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.id_Users == id_Users);
                if (existingUser == null)
                {
                    return false;
                }
                _context.Users.Attach(updatedUser);
                _context.Entry(updatedUser).State = EntityState.Modified;
             
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}