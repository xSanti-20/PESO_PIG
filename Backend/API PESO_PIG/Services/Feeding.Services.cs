using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PESO_PIG.Services
{
    public class FeedingServices
    {
        private readonly AppDbContext _context;
        public FeedingServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los Feedings
        public IEnumerable<Feeding> GetFeedings()
        {
            return _context.Feedings
                .Include(p => p.user)
                .Include(p => p.Corral)
                .Include(p => p.food).ToList();
        }

        // Obtener un Feeding por ID
        public async Task<Feeding> GetFeedingById(int id_Feeding)
        {
            try
            {
                return await _context.Feedings.FirstOrDefaultAsync(x => x.id_Feeding == id_Feeding);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar un nuevo Feeding
        public void Add(Feeding entity)
        {
            _context.Feedings.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar un Feeding por ID
        public async Task<bool> DelFeeding(int id_Feeding)
        {
            try
            {
                var feeding = await _context.Feedings.FindAsync(id_Feeding);
                if (feeding != null)
                {
                    _context.Feedings.Remove(feeding);
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

        // Actualizar un Feeding existente por ID
        public async Task<bool> UpdateFeeding(int id_Feeding, Feeding updatedFeeding)
        {
            try
            {
                if (id_Feeding != updatedFeeding.id_Feeding)
                {
                    throw new ArgumentException("El ID del Feeding no coincide.");
                }
                var existingFeeding = await _context.Feedings.AsNoTracking().FirstOrDefaultAsync(f => f.id_Feeding == id_Feeding);
                if (existingFeeding == null)
                {
                    return false;
                }
                _context.Feedings.Attach(updatedFeeding);
                _context.Entry(updatedFeeding).State = EntityState.Modified;

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
