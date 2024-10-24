using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PESO_PIG.Services
{
    public class CorralServices
    {
        private readonly AppDbContext _context;
        public CorralServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los corrales
        public IEnumerable<Corral> GetCorrals()
        {
            return _context.Corrals.ToList(); // Asegúrate de que "Corrales" sea el DbSet en tu DbContext
        }

        // Obtener un corral por ID
        public async Task<Corral> GetCorralById(int id_Corral)
        {
            try
            {
                return await _context.Corrals.FirstOrDefaultAsync(x => x.id_Corral == id_Corral);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar un nuevo corral
        public void Add(Corral entity)
        {
            _context.Corrals.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar un corral por ID
        public async Task<bool> DelCorral(int id_Corral)
        {
            try
            {
                var corral = await _context.Corrals.FindAsync(id_Corral);
                if (corral != null)
                {
                    _context.Corrals.Remove(corral);
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

        // Actualizar un corral existente por ID
        public async Task<bool> UpdateCorral(int id_Corral, Corral updatedCorral)
        {
            try
            {
                if (id_Corral != updatedCorral.id_Corral)
                {
                    throw new ArgumentException("El ID del corral no coincide.");
                }
                var existingCorral = await _context.Corrals.AsNoTracking().FirstOrDefaultAsync(c => c.id_Corral == id_Corral);
                if (existingCorral == null)
                {
                    return false;
                }
                _context.Corrals.Attach(updatedCorral);
                _context.Entry(updatedCorral).State = EntityState.Modified;

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
