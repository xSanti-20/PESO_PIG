using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace API_PESO_PIG.Services
{
    public class WeighingServices
    {
        private readonly AppDbContext _context;
        private readonly IServiceProvider _serviceProvider;

        public WeighingServices(AppDbContext context, IServiceProvider serviceProvider = null)
        {
            _context = context;
            _serviceProvider = serviceProvider;
        }

        // Obtener todos los registros de Weighing
        public IEnumerable<Weighing> GetWeighings()
        {
            return _context.Weighings
                .Include(p => p.piglet)
                .Include(p => p.user).ToList();
        }

        // Obtener Weighing por ID
        public async Task<Weighing> GetWeighingId(int id_Weighings)
        {
            try
            {
                return await _context.Weighings
                    .Include(p => p.piglet)
                    .Include(p => p.user)
                    .FirstOrDefaultAsync(x => x.id_Weighings == id_Weighings);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Obtener pesajes por ID de cerdo
        public async Task<IEnumerable<Weighing>> GetWeighingsByPigletId(int pigletId)
        {
            return await _context.Weighings
                .Where(w => w.Id_Piglet == pigletId)
                .OrderBy(w => w.Fec_Weight)
                .ToListAsync();
        }

        // Agregar un nuevo registro de Weighing
        public void Add(Weighing entity)
        {
            _context.Weighings.Add(entity);
            _context.SaveChanges();

            // Después de agregar un nuevo pesaje, actualizar el peso acumulado del cerdo
            UpdatePigletAccumulatedWeight(entity.Id_Piglet, entity.Weight_Gain);
        }

        // Eliminar Weighing por ID
        public async Task<bool> DelWeighing(int id_Weighings)
        {
            try
            {
                var weighing = await _context.Weighings.FindAsync(id_Weighings);
                if (weighing != null)
                {
                    // Guardar información antes de eliminar
                    int pigletId = weighing.Id_Piglet;
                    int weightGain = weighing.Weight_Gain;

                    // Eliminar el registro
                    _context.Weighings.Remove(weighing);
                    await _context.SaveChangesAsync();

                    // Actualizar el peso acumulado del cerdo restando la ganancia de peso
                    UpdatePigletAccumulatedWeight(pigletId, -weightGain);
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

                // Obtener el pesaje original para calcular la diferencia en ganancia de peso
                var originalWeighing = await _context.Weighings.AsNoTracking()
                    .FirstOrDefaultAsync(u => u.id_Weighings == id_Weighings);

                if (originalWeighing == null)
                {
                    return false;
                }

                // Guardar la ganancia de peso anterior
                int oldWeightGain = originalWeighing.Weight_Gain;

                // Actualizar el registro
                _context.Weighings.Attach(updatedWeighing);
                _context.Entry(updatedWeighing).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Si la ganancia de peso cambió, actualizar el peso acumulado del cerdo
                if (oldWeightGain != updatedWeighing.Weight_Gain)
                {
                    // Calcular la diferencia en la ganancia de peso
                    int weightGainDiff = updatedWeighing.Weight_Gain - oldWeightGain;

                    // Actualizar el peso acumulado del cerdo con la diferencia
                    UpdatePigletAccumulatedWeight(updatedWeighing.Id_Piglet, weightGainDiff);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Método para actualizar el peso acumulado del cerdo
        private void UpdatePigletAccumulatedWeight(int pigletId, int weightGain)
        {
            var piglet = _context.Piglets.FirstOrDefault(p => p.Id_Piglet == pigletId);
            if (piglet != null)
            {
                // Actualizar el peso acumulado sumando la ganancia de peso
                piglet.Acum_Weight += weightGain;
                _context.SaveChanges();
            }
        }

        // Método para recalcular el peso acumulado de un cerdo basado en su peso inicial y los pesajes
        public void RecalculatePigletAccumulatedWeight(int pigletId, int newInitialWeight)
        {
            // Obtener el cerdo
            var piglet = _context.Piglets.FirstOrDefault(p => p.Id_Piglet == pigletId);
            if (piglet == null) return;

            // Verificar que el peso inicial se haya actualizado correctamente
            if (piglet.Weight_Initial != newInitialWeight)
            {
                piglet.Weight_Initial = newInitialWeight;
                _context.SaveChanges();
            }

            // Obtener todos los pesajes del cerdo ordenados por fecha
            var weighings = _context.Weighings
                .Where(w => w.Id_Piglet == pigletId)
                .OrderBy(w => w.Fec_Weight)
                .ToList();

            if (!weighings.Any())
            {
                // Si no hay pesajes, el peso acumulado es igual al peso inicial
                piglet.Acum_Weight = newInitialWeight;
                _context.SaveChanges();
                return;
            }

            // Actualizar la ganancia de peso de cada pesaje basado en el nuevo peso inicial
            foreach (var weighing in weighings)
            {
                // La ganancia de peso es el peso medido menos el peso inicial
                weighing.Weight_Gain = weighing.Weight_Current - newInitialWeight;
                _context.Entry(weighing).State = EntityState.Modified;
            }

            // El peso acumulado del cerdo es el peso inicial más la suma de todas las ganancias de peso
            piglet.Acum_Weight = newInitialWeight + weighings.Sum(w => w.Weight_Gain);

            _context.SaveChanges();
        }
    }
}
