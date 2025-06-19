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

        public class StageInfo
        {
            public string Name { get; set; }
            public float WeightMin { get; set; }
            public float WeightMax { get; set; }
            public int MaxDays { get; set; }
            public string NextStage { get; set; }
        }

        public class StageTransitionResult
        {
            public int PigletId { get; set; }
            public string PigletName { get; set; }
            public string CurrentStage { get; set; }
            public string NewStage { get; set; }
            public float CurrentWeight { get; set; }
            public int DaysInStage { get; set; }
            public bool StageChanged { get; set; }
            public bool IsWeightDeficient { get; set; }
            public string TransitionReason { get; set; }
            public string Message { get; set; }
            public bool Success { get; set; } = true;
        }

        private static readonly Dictionary<string, StageInfo> StageDefinitions = new()
        {
            ["PRECEBO"] = new StageInfo { Name = "Precebo", WeightMin = 6.5f, WeightMax = 30f, MaxDays = 49, NextStage = "LEVANTE" },
            ["PRE_INICIACION"] = new StageInfo { Name = "Pre-iniciación", WeightMin = 6.5f, WeightMax = 17.5f, MaxDays = 25, NextStage = "INICIACION" },
            ["INICIACION"] = new StageInfo { Name = "Iniciación", WeightMin = 17.5f, WeightMax = 30f, MaxDays = 24, NextStage = "LEVANTE" },
            ["LEVANTE"] = new StageInfo { Name = "Levante", WeightMin = 30f, WeightMax = 60f, MaxDays = 42, NextStage = "ENGORDE" },
            ["ENGORDE"] = new StageInfo { Name = "Engorde", WeightMin = 60f, WeightMax = 120f, MaxDays = 47, NextStage = "SACRIFICIO" }
        };

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

        // ✅ CORREGIDO: Ahora actualiza el promedio del corral
        public async Task Add(Piglet entity)
        {
            if (entity.Acum_Weight <= 0)
                entity.Acum_Weight = entity.Weight_Initial;

            entity.Sta_Date = DateTime.Now;

            var corral = _context.Corrals.FirstOrDefault(c => c.id_Corral == entity.Id_Corral);
            if (corral != null)
            {
                corral.Tot_Animal += 1;
                corral.Est_Corral = "ocupado";
                _context.Corrals.Update(corral);
            }

            _context.Piglets.Add(entity);
            await _context.SaveChangesAsync();

            // ✅ ACTUALIZAR PROMEDIO DEL CORRAL DESPUÉS DE AGREGAR
            await UpdateCorralAverageWeight(entity.Id_Corral);
        }

        // ✅ CORREGIDO: Ahora actualiza el promedio del corral
        public async Task<bool> DelPiglet(int id_Piglet)
        {
            var piglet = await _context.Piglets.FindAsync(id_Piglet);
            if (piglet != null)
            {
                int corralId = piglet.Id_Corral;

                var corral = await _context.Corrals.FindAsync(piglet.Id_Corral);
                if (corral != null)
                {
                    corral.Tot_Animal = Math.Max(0, corral.Tot_Animal - 1);
                    if (corral.Tot_Animal == 0)
                    {
                        corral.Est_Corral = "libre";
                        corral.Tot_Pesaje = 0; // Sin animales, promedio = 0
                    }
                    _context.Corrals.Update(corral);
                }

                _context.Piglets.Remove(piglet);
                await _context.SaveChangesAsync();

                // ✅ ACTUALIZAR PROMEDIO DEL CORRAL DESPUÉS DE ELIMINAR
                if (corral != null && corral.Tot_Animal > 0)
                {
                    await UpdateCorralAverageWeight(corralId);
                }

                return true;
            }
            return false;
        }

        // ✅ CORREGIDO: Ahora actualiza el promedio del corral
        public async Task<bool> UpdatePiglet(int id_Piglet, Piglet updatedPiglet)
        {
            if (id_Piglet != updatedPiglet.Id_Piglet)
                throw new ArgumentException("El ID del lechón no coincide.");

            var existing = await _context.Piglets.AsNoTracking().FirstOrDefaultAsync(p => p.Id_Piglet == id_Piglet);
            if (existing == null) return false;

            var oldStage = existing.Id_Stage;
            var newStage = updatedPiglet.Id_Stage;

            if (oldStage != newStage)
                updatedPiglet.Sta_Date = DateTime.Now;
            else
                updatedPiglet.Sta_Date = existing.Sta_Date;

            // Manejar cambio de corral
            if (existing.Id_Corral != updatedPiglet.Id_Corral)
            {
                var oldCorral = await _context.Corrals.FindAsync(existing.Id_Corral);
                var newCorral = await _context.Corrals.FindAsync(updatedPiglet.Id_Corral);

                if (oldCorral != null)
                {
                    oldCorral.Tot_Animal = Math.Max(0, oldCorral.Tot_Animal - 1);
                    if (oldCorral.Tot_Animal == 0)
                    {
                        oldCorral.Est_Corral = "libre";
                        oldCorral.Tot_Pesaje = 0;
                    }
                    _context.Corrals.Update(oldCorral);
                }

                if (newCorral != null)
                {
                    newCorral.Tot_Animal += 1;
                    newCorral.Est_Corral = "ocupado";
                    _context.Corrals.Update(newCorral);
                }
            }

            _context.Piglets.Update(updatedPiglet);
            await _context.SaveChangesAsync();

            // ✅ ACTUALIZAR PROMEDIO DE AMBOS CORRALES
            if (existing.Id_Corral != updatedPiglet.Id_Corral)
            {
                // Actualizar corral anterior
                if (existing.Id_Corral > 0)
                    await UpdateCorralAverageWeight(existing.Id_Corral);

                // Actualizar corral nuevo
                await UpdateCorralAverageWeight(updatedPiglet.Id_Corral);
            }
            else
            {
                // Solo actualizar el corral actual (cambió el peso)
                await UpdateCorralAverageWeight(updatedPiglet.Id_Corral);
            }

            // Siempre verificar etapa después de actualizar
            await CheckAndUpdateStageWithRegression(id_Piglet);

            return true;
        }

        public async Task<StageTransitionResult> CheckAndUpdateStage(int pigletId)
        {
            var piglet = await _context.Piglets
                .Include(p => p.stage)
                .FirstOrDefaultAsync(p => p.Id_Piglet == pigletId);

            if (piglet == null)
                return new StageTransitionResult { Success = false, Message = "Lechón no encontrado", PigletId = pigletId };

            // USAR EL PESO ACUMULADO ACTUALIZADO
            float currentWeight = piglet.Acum_Weight;

            var result = new StageTransitionResult
            {
                PigletId = piglet.Id_Piglet,
                PigletName = piglet.Name_Piglet,
                CurrentStage = piglet.stage?.Name_Stage ?? "Sin etapa",
                CurrentWeight = currentWeight,
                Success = true
            };

            if (!piglet.Sta_Date.HasValue)
            {
                piglet.Sta_Date = DateTime.Now;
                _context.Entry(piglet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            var daysInStage = (DateTime.Now - piglet.Sta_Date.Value).Days;
            result.DaysInStage = daysInStage;

            var currentStageKey = GetStageKey(piglet.stage?.Name_Stage);

            if (currentStageKey == null || !StageDefinitions.ContainsKey(currentStageKey))
            {
                result.Message = $"Etapa actual '{piglet.stage?.Name_Stage}' no reconocida en el sistema";
                return result;
            }

            var currentStageDef = StageDefinitions[currentStageKey];
            var nextStageKey = currentStageDef.NextStage;

            // Verificar si debe avanzar por peso
            if (currentWeight >= currentStageDef.WeightMax)
            {
                if (nextStageKey != null && StageDefinitions.ContainsKey(nextStageKey))
                {
                    var success = await TransitionToNextStage(piglet, nextStageKey, "Peso alcanzado");
                    if (success)
                    {
                        result.StageChanged = true;
                        result.NewStage = StageDefinitions[nextStageKey].Name;
                        result.TransitionReason = "Peso objetivo alcanzado";
                        result.Message = $"Transición por peso: {currentWeight}kg >= {currentStageDef.WeightMax}kg";
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "Error al realizar la transición por peso";
                    }
                }
                else
                {
                    result.Message = "Peso objetivo alcanzado - Listo para sacrificio";
                }
            }
            // Verificar si debe avanzar por tiempo
            else if (daysInStage >= currentStageDef.MaxDays)
            {
                if (nextStageKey != null && StageDefinitions.ContainsKey(nextStageKey))
                {
                    var success = await TransitionToNextStage(piglet, nextStageKey, "Tiempo límite alcanzado");
                    if (success)
                    {
                        result.StageChanged = true;
                        result.NewStage = StageDefinitions[nextStageKey].Name;
                        result.TransitionReason = "Tiempo límite alcanzado";
                        result.Message = $"Transición por tiempo: {daysInStage} días >= {currentStageDef.MaxDays} días";
                        result.IsWeightDeficient = true;
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "Error al realizar la transición por tiempo";
                    }
                }
                else
                {
                    result.Message = $"Tiempo límite alcanzado - Peso insuficiente: {currentWeight}kg";
                    result.IsWeightDeficient = true;
                }
            }
            else
            {
                var daysRemaining = currentStageDef.MaxDays - daysInStage;
                var weightRemaining = currentStageDef.WeightMax - currentWeight;
                result.Message = $"En progreso: {daysRemaining} días restantes, {weightRemaining:F1}kg para siguiente etapa";
            }

            return result;
        }

        // MÉTODO MEJORADO para manejar regresiones de etapa
        public async Task<StageTransitionResult> CheckAndUpdateStageWithRegression(int pigletId)
        {
            // PRIMERO: Refrescar el lechón desde la base de datos para obtener el peso actualizado
            var piglet = await _context.Piglets
                .Include(p => p.stage)
                .FirstOrDefaultAsync(p => p.Id_Piglet == pigletId);

            if (piglet == null)
                return new StageTransitionResult { Success = false, Message = "Lechón no encontrado", PigletId = pigletId };

            // USAR EL PESO ACUMULADO ACTUALIZADO
            float currentWeight = piglet.Acum_Weight;

            // Determinar la etapa correcta basada en el peso actual
            var correctStageKey = DetermineCorrectStageByWeight(currentWeight);
            var currentStageKey = GetStageKey(piglet.stage?.Name_Stage);

            var result = new StageTransitionResult
            {
                PigletId = piglet.Id_Piglet,
                PigletName = piglet.Name_Piglet,
                CurrentStage = piglet.stage?.Name_Stage ?? "Sin etapa",
                CurrentWeight = currentWeight,
                Success = true
            };

            Console.WriteLine($"DEBUG - Lechón {piglet.Name_Piglet}: Peso={currentWeight}kg, EtapaActual={currentStageKey}, EtapaCorrecta={correctStageKey}");

            // Si la etapa correcta es diferente a la actual, hacer la transición
            if (correctStageKey != currentStageKey && correctStageKey != null)
            {
                var success = await TransitionToNextStage(piglet, correctStageKey, "Ajuste automático por peso");
                if (success)
                {
                    result.StageChanged = true;
                    result.NewStage = StageDefinitions[correctStageKey].Name;
                    result.TransitionReason = "Ajuste automático por peso";
                    result.Message = $"Etapa ajustada de {piglet.stage?.Name_Stage} a {StageDefinitions[correctStageKey].Name} por peso actual: {currentWeight}kg";
                }
                else
                {
                    result.Success = false;
                    result.Message = "Error al ajustar la etapa";
                }
            }
            else
            {
                // Si no hay cambio necesario, verificar normalmente
                result.Message = $"Etapa correcta: {piglet.stage?.Name_Stage} para peso {currentWeight}kg";
            }

            return result;
        }

        private string DetermineCorrectStageByWeight(float weight)
        {
            // CORREGIDO: Si está entre 6.5 y 30 kg debe estar en PRECEBO
            if (weight >= 6.5f && weight < 30f) return "PRECEBO";
            if (weight >= 30f && weight < 60f) return "LEVANTE";
            if (weight >= 60f) return "ENGORDE";

            return "PRECEBO"; // Por defecto para pesos menores a 6.5kg
        }

        public async Task<List<StageTransitionResult>> CheckAllStages()
        {
            var results = new List<StageTransitionResult>();
            var piglets = await _context.Piglets
                .Include(p => p.stage)
                .Where(p => p.stage.Name_Stage != "SACRIFICIO")
                .ToListAsync();

            foreach (var piglet in piglets)
            {
                var result = await CheckAndUpdateStageWithRegression(piglet.Id_Piglet);
                results.Add(result);
            }

            return results;
        }

        private async Task<bool> TransitionToNextStage(Piglet piglet, string nextStageKey, string reason)
        {
            Console.WriteLine($"DEBUG - Intentando transición a: {nextStageKey}");

            // CORREGIDO: Buscar la etapa correcta en la base de datos
            Stage nextStage = null;

            if (nextStageKey == "PRECEBO")
            {
                nextStage = await _context.Stages
                    .FirstOrDefaultAsync(s => s.Name_Stage.ToUpper().Contains("PRECEBO"));
            }
            else if (nextStageKey == "LEVANTE")
            {
                nextStage = await _context.Stages
                    .FirstOrDefaultAsync(s => s.Name_Stage.ToUpper().Contains("LEVANTE"));
            }
            else if (nextStageKey == "ENGORDE")
            {
                nextStage = await _context.Stages
                    .FirstOrDefaultAsync(s => s.Name_Stage.ToUpper().Contains("ENGORDE"));
            }
            else
            {
                // Búsqueda genérica para otras etapas
                var nextStageName = StageDefinitions.ContainsKey(nextStageKey) ? StageDefinitions[nextStageKey].Name : nextStageKey;
                nextStage = await _context.Stages
                    .FirstOrDefaultAsync(s => s.Name_Stage.ToUpper().Contains(nextStageKey.ToUpper()) ||
                                              s.Name_Stage.ToUpper().Contains(nextStageName.ToUpper()));
            }

            if (nextStage == null)
            {
                Console.WriteLine($"ERROR: No se encontró la etapa {nextStageKey} en la base de datos");

                // Mostrar todas las etapas disponibles para debugging
                var availableStages = await _context.Stages.Select(s => s.Name_Stage).ToListAsync();
                Console.WriteLine($"Etapas disponibles: {string.Join(", ", availableStages)}");

                return false;
            }

            Console.WriteLine($"DEBUG - Etapa encontrada: {nextStage.Name_Stage} (ID: {nextStage.id_Stage})");

            piglet.Id_Stage = nextStage.id_Stage;
            piglet.Sta_Date = DateTime.Now;

            _context.Piglets.Update(piglet);
            await _context.SaveChangesAsync();

            Console.WriteLine($"SUCCESS: Lechón {piglet.Name_Piglet} cambió a etapa {nextStage.Name_Stage}");
            return true;
        }

        private string GetStageKey(string stageName)
        {
            if (string.IsNullOrEmpty(stageName)) return null;
            var upperName = stageName.ToUpper();

            // CORREGIDO: Reconocer PRECEBO como la etapa principal
            if (upperName.Contains("PRECEBO")) return "PRECEBO";
            if (upperName.Contains("PRE") && upperName.Contains("INICIACION")) return "PRECEBO";
            if (upperName.Contains("INICIACION") && !upperName.Contains("PRE")) return "PRECEBO";
            if (upperName.Contains("LEVANTE")) return "LEVANTE";
            if (upperName.Contains("ENGORDE")) return "ENGORDE";

            return null;
        }

        public Dictionary<string, StageInfo> GetStageDefinitions()
        {
            return StageDefinitions;
        }

        // ✅ NUEVO MÉTODO para actualizar promedio del corral
        private async Task UpdateCorralAverageWeight(int corralId)
        {
            var pigletsInCorral = await _context.Piglets
                .Where(p => p.Id_Corral == corralId)
                .ToListAsync();

            var corral = await _context.Corrals.FindAsync(corralId);
            if (corral == null) return;

            if (!pigletsInCorral.Any())
            {
                corral.Tot_Pesaje = 0;
                _context.Entry(corral).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return;
            }

            var currentWeights = new List<float>();

            foreach (var piglet in pigletsInCorral)
            {
                // Obtener el peso más actual (último pesaje o peso inicial)
                var lastWeighing = await _context.Weighings
                    .Where(w => w.Id_Piglet == piglet.Id_Piglet)
                    .OrderByDescending(w => w.Fec_Weight)
                    .ThenByDescending(w => w.id_Weighings)
                    .FirstOrDefaultAsync();

                float currentWeight = lastWeighing?.Weight_Current ?? piglet.Weight_Initial;
                currentWeights.Add(currentWeight);
            }

            // ✅ CALCULAR PROMEDIO (igual que en FeedingServices)
            var promedio = currentWeights.Average();
            corral.Tot_Pesaje = (float)Math.Round(promedio, 2);

            _context.Entry(corral).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            Console.WriteLine($"Promedio del corral {corralId} actualizado: {promedio:F2} kg");
        }
    }
}
