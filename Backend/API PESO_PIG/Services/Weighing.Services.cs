using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PESO_PIG.Services
{
    public class WeighingServices
    {
        private readonly AppDbContext _context;
        public WeighingServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los registros de Weighing
        public IEnumerable<Weighing> GetWeighings()
        {
            return _context.Weighings.ToList();
        }

        // Obtener Weighing por ID
        public async Task<Weighing> GetWeighingId(int id_Weighings)
        {
            try
            {
                return await _context.Weighings.FirstOrDefaultAsync(x => x.id_Weighings == id_Weighings);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar un nuevo registro de Weighing
        public void Add(Weighing entity)
        {
            _context.Weighings.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar Weighing por ID
        public async Task<bool> DelWeighing(int id_Weighings)
        {
            try
            {
                var weighing = await _context.Weighings.FindAsync(id_Weighings);
                if (weighing != null)
                {
                    _context.Weighings.Remove(weighing);
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

        // Actualizar un registro de Weighing
        public async Task<bool> UpdateWeighing(int id_Weighings, Weighing updatedWeighing)
        {
            try
            {
                if (id_Weighings != updatedWeighing.id_Weighings)
                {
                    throw new ArgumentException("El ID del registro no coincide.");
                }
                var existingWeighing = await _context.Weighings.AsNoTracking().FirstOrDefaultAsync(u => u.id_Weighings == id_Weighings);
                if (existingWeighing == null)
                {
                    return false;
                }
                _context.Weighings.Attach(updatedWeighing);
                _context.Entry(updatedWeighing).State = EntityState.Modified;

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
