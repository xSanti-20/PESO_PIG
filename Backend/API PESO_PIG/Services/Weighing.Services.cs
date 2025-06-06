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
            // Obtener el lechón para calcular la ganancia de peso correctamente
            var piglet = _context.Piglets.FirstOrDefault(p => p.Id_Piglet == entity.Id_Piglet);
            if (piglet != null)
            {
                // Calcular la ganancia de peso: peso actual - peso inicial
                entity.Weight_Gain = entity.Weight_Current - piglet.Weight_Initial;
            }

            _context.Weighings.Add(entity);
            _context.SaveChanges();

            // Después de agregar un nuevo pesaje, recalcular el peso acumulado del cerdo
            RecalculatePigletAccumulatedWeight(entity.Id_Piglet);
        }

        // Eliminar Weighing por ID
        public async Task<bool> DelWeighing(int id_Weighings)
        {
            try
            {
                var weighing = await _context.Weighings.FindAsync(id_Weighings);
                if (weighing != null)
                {
                    // Guardar el ID del lechón antes de eliminar
                    int pigletId = weighing.Id_Piglet;

                    // Eliminar el registro
                    _context.Weighings.Remove(weighing);
                    await _context.SaveChangesAsync();

                    // Recalcular el peso acumulado del cerdo después de eliminar el pesaje
                    RecalculatePigletAccumulatedWeight(pigletId);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Modificar el método UpdateWeighing para recalcular correctamente
        public async Task<bool> UpdateWeighing(int id_Weighings, Weighing updatedWeighing)
        {
            try
            {
                if (id_Weighings != updatedWeighing.id_Weighings)
                {
                    throw new ArgumentException("El ID del registro no coincide.");
                }

                // Obtener el lechón para calcular correctamente la ganancia de peso
                var piglet = await _context.Piglets.FirstOrDefaultAsync(p => p.Id_Piglet == updatedWeighing.Id_Piglet);
                if (piglet != null)
                {
                    // Recalcular la ganancia de peso basada en el peso inicial del lechón
                    updatedWeighing.Weight_Gain = updatedWeighing.Weight_Current - piglet.Weight_Initial;
                }

                // Actualizar el registro
                _context.Weighings.Attach(updatedWeighing);
                _context.Entry(updatedWeighing).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Recalcular el peso acumulado del cerdo
                RecalculatePigletAccumulatedWeight(updatedWeighing.Id_Piglet);

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Método corregido para recalcular el peso acumulado de un cerdo
        public void RecalculatePigletAccumulatedWeight(int pigletId, int? newInitialWeight = null)
        {
            // Obtener el cerdo
            var piglet = _context.Piglets.FirstOrDefault(p => p.Id_Piglet == pigletId);
            if (piglet == null) return;

            // Actualizar el peso inicial si se proporciona uno nuevo
            if (newInitialWeight.HasValue && piglet.Weight_Initial != newInitialWeight.Value)
            {
                piglet.Weight_Initial = newInitialWeight.Value;
            }

            // Obtener el último pesaje del cerdo (el más reciente)
            var lastWeighing = _context.Weighings
                .Where(w => w.Id_Piglet == pigletId)
                .OrderByDescending(w => w.Fec_Weight)
                .FirstOrDefault();

            if (lastWeighing != null)
            {
                // Si hay pesajes, el peso acumulado es el peso actual del último pesaje
                piglet.Acum_Weight = lastWeighing.Weight_Current;

                // Actualizar la ganancia de peso del último pesaje si cambió el peso inicial
                if (newInitialWeight.HasValue)
                {
                    lastWeighing.Weight_Gain = lastWeighing.Weight_Current - piglet.Weight_Initial;
                    _context.Entry(lastWeighing).State = EntityState.Modified;
                }
            }
            else
            {
                // Si no hay pesajes, el peso acumulado es igual al peso inicial
                piglet.Acum_Weight = piglet.Weight_Initial;
            }

            // Si se cambió el peso inicial, actualizar todas las ganancias de peso
            if (newInitialWeight.HasValue)
            {
                var allWeighings = _context.Weighings
                    .Where(w => w.Id_Piglet == pigletId)
                    .ToList();

                foreach (var weighing in allWeighings)
                {
                    weighing.Weight_Gain = weighing.Weight_Current - piglet.Weight_Initial;
                    _context.Entry(weighing).State = EntityState.Modified;
                }
            }

            _context.SaveChanges();
        }

        public void CreateWeighingAndUpdateCorral(Weighing entity)
        {
            // Obtener el lechón para calcular la ganancia de peso correctamente
            var piglet = _context.Piglets.FirstOrDefault(p => p.Id_Piglet == entity.Id_Piglet);
            if (piglet == null) throw new Exception("Lechón no encontrado");

            // Calcular la ganancia de peso: peso actual - peso inicial
            entity.Weight_Gain = entity.Weight_Current - piglet.Weight_Initial;

            // Guardar el nuevo pesaje
            _context.Weighings.Add(entity);
            _context.SaveChanges();

            // Actualizar el peso acumulado del lechón
            RecalculatePigletAccumulatedWeight(entity.Id_Piglet);

            var corralId = piglet.Id_Corral;

            // Obtener todos los lechones del corral
            var pigletsInCorral = _context.Piglets.Where(p => p.Id_Corral == corralId).ToList();

            // Para cada lechón obtener el último peso registrado (si existe) o el peso inicial
            var pesosActuales = pigletsInCorral.Select(p =>
            {
                var lastWeighing = _context.Weighings
                    .Where(w => w.Id_Piglet == p.Id_Piglet)
                    .OrderByDescending(w => w.Fec_Weight)
                    .FirstOrDefault();

                return lastWeighing != null ? lastWeighing.Weight_Current : p.Weight_Initial;
            }).ToList();

            // Calcular promedio (promedio real: suma / cantidad)
            var promedio = pesosActuales.Any()
                ? (int)Math.Round(pesosActuales.Average(), 0)  // redondear al entero más cercano
                : 0;

            // Actualizar el corral con el promedio calculado
            var corral = _context.Corrals.FirstOrDefault(c => c.id_Corral == corralId);
            if (corral != null)
            {
                corral.Tot_Pesaje = promedio;
                _context.SaveChanges();
            }
        }
    }
}