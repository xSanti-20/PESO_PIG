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

        public IEnumerable<Corral> GetCorrals()
        {
            return _context.Corrals.ToList();
        }

        public async Task<Corral> GetCorralById(int id_Corral)
        {
            return await _context.Corrals.FirstOrDefaultAsync(x => x.id_Corral == id_Corral);
        }

        public void Add(Corral entity)
        {
            // Establecer el estado como "libre" al crear un nuevo corral
            entity.Est_Corral = "libre";

            _context.Corrals.Add(entity);
            _context.SaveChanges();
        }

        public async Task<bool> DelCorral(int id_Corral)
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

        public async Task<bool> UpdateCorral(int id_Corral, Corral updatedCorral)
        {
            if (id_Corral != updatedCorral.id_Corral)
                throw new ArgumentException("El ID del corral no coincide.");

            var existing = await _context.Corrals.AsNoTracking().FirstOrDefaultAsync(c => c.id_Corral == id_Corral);
            if (existing == null)
                return false;

            _context.Corrals.Attach(updatedCorral);
            _context.Entry(updatedCorral).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
