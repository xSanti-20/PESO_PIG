using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PESO_PIG.Services
{
    public class EntriesServices
    {
        private readonly AppDbContext _context;
        public EntriesServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todas las entradas
        public IEnumerable<Entries> GetEntries()
        {
            return _context.Entries
                .Include(p => p.food).ToList();
        }

        // Obtener una entrada por ID
        public async Task<Entries> GetEntriesById(int id_Entries)
        {
            try
            {
                return await _context.Entries.FirstOrDefaultAsync(x => x.id_Entries == id_Entries);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar una nueva entrada
        public void Add(Entries entity)
        {
            _context.Entries.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar una entrada por ID
        public async Task<bool> DelEntries(int id_Entries)
        {
            try
            {
                var entries = await _context.Entries.FindAsync(id_Entries);
                if (entries != null)
                {
                    _context.Entries.Remove(entries);
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

        // Actualizar una entrada existente por ID
        public async Task<bool> UpdateEntries(int id_Entries, Entries updatedEntries)
        {
            try
            {
                if (id_Entries != updatedEntries.id_Entries)
                {
                    throw new ArgumentException("El ID de la entrada no coincide.");
                }
                var existingEntries = await _context.Entries.AsNoTracking().FirstOrDefaultAsync(c => c.id_Entries == id_Entries);
                if (existingEntries == null)
                {
                    return false;
                }
                _context.Entries.Attach(updatedEntries);
                _context.Entry(updatedEntries).State = EntityState.Modified;

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