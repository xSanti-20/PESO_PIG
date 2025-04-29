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
            return _context.Piglets
                .Include(p => p.race)
                .Include(p => p.stage)
                .Include(p => p.corral).ToList();
        }

        // Obtener piglet por ID
        public async Task<Piglet> GetPigletId(int id_Piglet)
        {
            try
            {
                return await _context.Piglets
                    .Include(p => p.race)
                    .Include(p => p.stage)
                    .Include(p => p.corral)
                    .FirstOrDefaultAsync(x => x.Id_Piglet == id_Piglet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Agregar nuevo piglet
        public void Add(Piglet entity)
        {
            try
            {
                // Asegurarse de que el peso acumulado inicial sea igual al peso inicial
                if (entity.Acum_Weight <= 0)
                {
                    entity.Acum_Weight = entity.Weight_Initial;
                }

                // Sumar 1 al total de animales en el corral
                var corral = _context.Corrals.FirstOrDefault(c => c.id_Corral == entity.Id_Corral);
                if (corral != null)
                {
                    corral.Tot_Animal += 1;  // Aumenta el contador de animales
                    _context.Corrals.Update(corral);  // Actualiza el corral en la base de datos
                }

                _context.Piglets.Add(entity);  // Agrega el nuevo lechón
                _context.SaveChanges();  // Guarda los cambios en la base de datos
            }
            catch (Exception ex)
            {
                // Manejo de errores
                Console.WriteLine($"Error al agregar piglet: {ex.Message}");
                throw;
            }
        }

        // Eliminar piglet por ID
        public async Task<bool> DelPiglet(int id_Piglet)
        {
            try
            {
                var piglet = await _context.Piglets.FindAsync(id_Piglet);
                if (piglet != null)
                {
                    // Restar 1 al total de animales del corral cuando se elimina el piglet
                    var corral = await _context.Corrals.FindAsync(piglet.Id_Corral);
                    if (corral != null && corral.Tot_Animal > 0)
                    {
                        corral.Tot_Animal -= 1;  // Restamos el contador de animales
                        _context.Corrals.Update(corral);  // Actualiza el corral
                    }

                    _context.Piglets.Remove(piglet);  // Elimina el lechón
                    await _context.SaveChangesAsync();  // Guarda los cambios
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

                // Si el corral cambió, actualizar Tot_Animal en ambos corrales
                if (existingPiglet.Id_Corral != updatedPiglet.Id_Corral)
                {
                    var oldCorral = await _context.Corrals.FindAsync(existingPiglet.Id_Corral);
                    var newCorral = await _context.Corrals.FindAsync(updatedPiglet.Id_Corral);

                    if (oldCorral != null && oldCorral.Tot_Animal > 0)
                    {
                        oldCorral.Tot_Animal -= 1;
                        _context.Corrals.Update(oldCorral);
                    }

                    if (newCorral != null)
                    {
                        newCorral.Tot_Animal += 1;
                        _context.Corrals.Update(newCorral);
                    }
                }

                bool initialWeightChanged = existingPiglet.Weight_Initial != updatedPiglet.Weight_Initial;

                _context.Piglets.Attach(updatedPiglet);
                _context.Entry(updatedPiglet).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                if (initialWeightChanged)
                {
                    // Si el peso inicial cambió, realizar recalculo (si aplica)
                }

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Método para actualizar directamente el peso acumulado de un cerdo
        public async Task<bool> UpdatePigletAccumulatedWeight(int id_Piglet, int newAccumulatedWeight)
        {
            try
            {
                var piglet = await _context.Piglets.FindAsync(id_Piglet);
                if (piglet == null)
                {
                    return false;
                }

                piglet.Acum_Weight = newAccumulatedWeight;
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
