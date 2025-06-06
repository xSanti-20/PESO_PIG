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

        public IEnumerable<Piglet> GetPiglets()
        {
            return _context.Piglets
                .Include(p => p.race)
                .Include(p => p.stage)
                .Include(p => p.corral)
                .ToList();
        }

        public async Task<Piglet> GetPigletId(int id_Piglet)
        {
            return await _context.Piglets
                .Include(p => p.race)
                .Include(p => p.stage)
                .Include(p => p.corral)
                .FirstOrDefaultAsync(x => x.Id_Piglet == id_Piglet);
        }

        public void Add(Piglet entity)
        {
            try
            {
                if (entity.Acum_Weight <= 0)
                    entity.Acum_Weight = entity.Weight_Initial;

                var corral = _context.Corrals.FirstOrDefault(c => c.id_Corral == entity.Id_Corral);
                if (corral != null)
                {
                    corral.Tot_Animal += 1;
                    corral.Tot_Pesaje += entity.Acum_Weight;

                    // Cambiar el estado del corral a "ocupado" cuando se agrega un lechón
                    corral.Est_Corral = "ocupado";

                    _context.Corrals.Update(corral);
                }

                _context.Piglets.Add(entity);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al agregar piglet: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DelPiglet(int id_Piglet)
        {
            try
            {
                var piglet = await _context.Piglets.FindAsync(id_Piglet);
                if (piglet != null)
                {
                    var corral = await _context.Corrals.FindAsync(piglet.Id_Corral);
                    if (corral != null)
                    {
                        corral.Tot_Animal = Math.Max(0, corral.Tot_Animal - 1);
                        corral.Tot_Pesaje = Math.Max(0, corral.Tot_Pesaje - piglet.Acum_Weight);

                        // Si ya no hay animales en el corral, cambiar estado a "libre"
                        if (corral.Tot_Animal == 0)
                        {
                            corral.Est_Corral = "libre";
                        }

                        _context.Corrals.Update(corral);
                    }

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

        public async Task<bool> UpdatePiglet(int id_Piglet, Piglet updatedPiglet)
        {
            try
            {
                if (id_Piglet != updatedPiglet.Id_Piglet)
                    throw new ArgumentException("El ID del piglet no coincide.");

                var existing = await _context.Piglets.AsNoTracking().FirstOrDefaultAsync(p => p.Id_Piglet == id_Piglet);
                if (existing == null)
                    return false;

                var oldWeight = existing.Acum_Weight;
                var newWeight = updatedPiglet.Acum_Weight;

                if (existing.Id_Corral != updatedPiglet.Id_Corral)
                {
                    var oldCorral = await _context.Corrals.FindAsync(existing.Id_Corral);
                    var newCorral = await _context.Corrals.FindAsync(updatedPiglet.Id_Corral);

                    if (oldCorral != null)
                    {
                        oldCorral.Tot_Animal = Math.Max(0, oldCorral.Tot_Animal - 1);
                        oldCorral.Tot_Pesaje = Math.Max(0, oldCorral.Tot_Pesaje - oldWeight);

                        // Si ya no hay animales en el corral antiguo, cambiar estado a "libre"
                        if (oldCorral.Tot_Animal == 0)
                        {
                            oldCorral.Est_Corral = "libre";
                        }

                        _context.Corrals.Update(oldCorral);
                    }

                    if (newCorral != null)
                    {
                        newCorral.Tot_Animal += 1;
                        newCorral.Tot_Pesaje += newWeight;

                        // Cambiar el estado del nuevo corral a "ocupado"
                        newCorral.Est_Corral = "ocupado";

                        _context.Corrals.Update(newCorral);
                    }
                }
                else if (oldWeight != newWeight)
                {
                    var corral = await _context.Corrals.FindAsync(existing.Id_Corral);
                    if (corral != null)
                    {
                        corral.Tot_Pesaje += (newWeight - oldWeight);
                        _context.Corrals.Update(corral);
                    }
                }

                _context.Piglets.Update(updatedPiglet);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> VerificarCambioEtapa(int id_Piglet)
        {
            try
            {
                // Buscar el lechón por ID
                var piglet = await _context.Piglets.FindAsync(id_Piglet);
                if (piglet == null) return false;

                // Verificar cambio de etapa
                var currentStage = await _context.Stages.FirstOrDefaultAsync(s => s.id_Stage == piglet.Id_Stage);
                if (currentStage != null && piglet.Sta_Date.HasValue)
                {
                    var daysInStage = (DateTime.Now - piglet.Sta_Date.Value).TotalDays;

                    var nextStage = await _context.Stages
                        .Where(s => s.Weight_From > currentStage.Weight_From)
                        .OrderBy(s => s.Weight_From)
                        .FirstOrDefaultAsync();

                    if (nextStage != null)
                    {
                        if (piglet.Acum_Weight >= nextStage.Weight_From)
                        {
                            piglet.Id_Stage = nextStage.id_Stage;
                            piglet.Sta_Date = DateTime.Now;
                            Console.WriteLine($"🐖 Cerdo {piglet.Id_Piglet} ha pasado automáticamente a la etapa {nextStage.Name_Stage}.");
                        }
                        else if (daysInStage >= currentStage.Dur_Stage)
                        {
                            Console.WriteLine($"⚠️ Alerta: El cerdo {piglet.Id_Piglet} no ha alcanzado el peso mínimo después de {currentStage.Dur_Stage} días en la etapa {currentStage.Name_Stage}.");
                        }
                    }
                }

                _context.Piglets.Update(piglet);
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
