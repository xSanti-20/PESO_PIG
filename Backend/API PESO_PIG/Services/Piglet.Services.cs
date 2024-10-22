using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PESO_PIG.Services
{
    public class PigletServices
    {
        private readonly AppDbContext _context;
        public PigletServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los piglets
        public IEnumerable<Piglet> GetPiglets()
        {
            return _context.Piglets.ToList();
        }

        // Obtener piglet por ID
        public async Task<Piglet> GetPigletId(int id_Piglet)
        {
            try
            {
                return await _context.Piglets.FirstOrDefaultAsync(x => x.Id_Piglet == id_Piglet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar nuevo piglet
        public void Add(Piglet entity)
        {
            _context.Piglets.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar piglet por ID
        public async Task<bool> DelPiglet(int id_Piglet)
        {
            try
            {
                var piglet = await _context.Piglets.FindAsync(id_Piglet);
                if (piglet != null)
                {
                    _context.Piglets.Remove(piglet);
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

        // Actualizar piglet
        public async Task<bool> UpdatePiglet(int id_Piglet, Piglet updatedPiglet)
        {
            try
            {
                if (id_Piglet != updatedPiglet.Id_Piglet)
                {
                    throw new ArgumentException("El ID del piglet no coincide.");
                }
                var existingPiglet = await _context.Piglets.AsNoTracking().FirstOrDefaultAsync(u => u.Id_Piglet == id_Piglet);
                if (existingPiglet == null)
                {
                    return false;
                }
                _context.Piglets.Attach(updatedPiglet);
                _context.Entry(updatedPiglet).State = EntityState.Modified;

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
