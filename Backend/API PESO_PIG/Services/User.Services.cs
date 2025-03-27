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

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new User
                {
                    id_Users = u.id_Users,
                    Email = u.Email,
                    Hashed_Password = u.Hashed_Password ?? string.Empty, // Asegurarse de que no sea NULL
                    Salt = u.Salt ?? string.Empty, // Asegurarse de que no sea NULL
                    Token = u.Token ?? string.Empty, // Asegurarse de que no sea NULL
                    Blockade = u.Blockade,
                    ResetToken = u.ResetToken ?? string.Empty, // Asegurarse de que no sea NULL
                    ResetTokenExpiration = u.ResetTokenExpiration ?? DateTime.UtcNow // Si es NULL, asigna la fecha actual
                })
                .FirstOrDefaultAsync();
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
                _context.Users.Update(updatedUser);
                _context.SaveChanges();

                var existingUser = await _context.Users.FindAsync(id_Users);
                if (existingUser == null)
                {
                    return false;
                }


                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "El modelo de usuario es nulo");
            }

            var existingResponsible = await _context.Users
                .Where(u => u.id_Users == user.id_Users)
                .FirstOrDefaultAsync();

            if (existingResponsible == null)
            {
                throw new ArgumentException("Usuario no encontrado");
            }

            existingResponsible.Email = user.Email;
            existingResponsible.Hashed_Password = user.Hashed_Password;
            existingResponsible.Salt = user.Salt;
            existingResponsible.Token = user.Token;
            existingResponsible.Blockade = user.Blockade;
            existingResponsible.ResetToken = user.ResetToken;
            existingResponsible.ResetTokenExpiration = user.ResetTokenExpiration;

            await _context.SaveChangesAsync();
        }
        public async Task<User> GetResponsibleByResetToken(string token)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == token && u.ResetTokenExpiration > DateTime.UtcNow);
        }

        public async Task<User> GetByTokenAsync(string token)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == token);
        }

    }
}