﻿using API_PESO_PIG.DTOs;
using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[Controller]")]
    public class PigletController : Controller
    {
        public IConfiguration _Configuration;
        public readonly PigletServices _Services;
        public UserFunction GeneralFunction;

        public PigletController(IConfiguration configuration, PigletServices pigletServices)
        {
            _Configuration = configuration;
            _Services = pigletServices;
            GeneralFunction = new UserFunction(configuration);
        }

        [Authorize]
        [HttpPost("CreatePiglet")]
        public async Task<IActionResult> Add(Piglet entity)
        {
            try
            {
                await _Services.Add(entity);
                return Ok(new { message = "Lechón creado con éxito." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("ConsultAllPiglets")]
        public ActionResult<IEnumerable<Piglet>> GetPiglets()
        {
            try
            {
                var piglets = _Services.GetPiglets().Select(p => new PigletsDTO
                {
                    Id_Piglet = p.Id_Piglet,
                    Name_Piglet = p.Name_Piglet,
                    Weight_Initial = p.Weight_Initial,
                    Acum_Weight = p.Acum_Weight,
                    Fec_Birth = p.Fec_Birth,
                    Sex_Piglet = p.Sex_Piglet,
                    Placa_Sena = p.Placa_Sena,
                    Sta_Date = p.Sta_Date ?? DateTime.Now,
                    Des_Corral = p.corral?.Des_Corral,
                    Nam_Race = p.race?.Nam_Race,
                    Name_Stage = p.stage?.Name_Stage,
                    Is_Active = p.Is_Active // ✅ Agregar campo de estado
                }).ToList();

                return Ok(piglets);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("GetPigletId")]
        public async Task<IActionResult> GetPigletId(int id_Piglet)
        {
            try
            {
                var piglet = await _Services.GetPigletId(id_Piglet);

                if (piglet == null)
                {
                    return NotFound("Lechón no existe en la BD.");
                }

                return Ok(piglet);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("DeletePiglet")]
        public async Task<IActionResult> DelPiglet(int id_Piglet)
        {
            try
            {
                var result = await _Services.DelPiglet(id_Piglet);
                if (result)
                {
                    return Ok(new { message = "Lechón eliminado correctamente." });
                }
                return NotFound("El lechón no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // ✅ NUEVO MÉTODO: Activar/Desactivar lechón
        [Authorize]
        [HttpPut("ToggleStatus")]
        public async Task<IActionResult> ToggleStatus(int id_Piglet, bool isActive)
        {
            try
            {
                var result = await _Services.ToggleStatus(id_Piglet, isActive);
                if (result)
                {
                    return Ok(new
                    {
                        message = $"Lechón {(isActive ? "activado" : "desactivado")} correctamente.",
                        success = true
                    });
                }
                return NotFound("El lechón no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("UpdatePiglet")]
        public async Task<IActionResult> UpdatePiglet(Piglet updatedPiglet)
        {
            if (updatedPiglet == null)
            {
                return BadRequest("El lechón no es válido.");
            }

            try
            {
                var result = await _Services.UpdatePiglet(updatedPiglet.Id_Piglet, updatedPiglet);

                if (!result)
                {
                    return NotFound("Lechón no existe en la BD.");
                }

                return Ok(new { message = "Lechón actualizado correctamente y etapa verificada." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("CheckStage/{pigletId}")]
        public async Task<IActionResult> CheckStage(int pigletId)
        {
            try
            {
                var result = await _Services.CheckAndUpdateStageWithRegression(pigletId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("CheckAllStages")]
        public async Task<IActionResult> CheckAllStages()
        {
            try
            {
                var results = await _Services.CheckAllStages();

                var summary = new
                {
                    TotalProcessed = results.Count,
                    StageChanges = results.Count(r => r.StageChanged),
                    WeightDeficient = results.Count(r => r.IsWeightDeficient),
                    Errors = results.Count(r => !r.Success),
                    Details = results
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("GetStageDefinitions")]
        public IActionResult GetStageDefinitions()
        {
            try
            {
                var definitions = _Services.GetStageDefinitions();
                return Ok(definitions);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // ✅ AGREGAR ESTOS MÉTODOS A TU CONTROLADOR PigletController

        [Authorize]
        [HttpGet("ConsultActivePiglets")]
        public ActionResult<IEnumerable<Piglet>> GetActivePiglets()
        {
            try
            {
                var piglets = _Services.GetActivePiglets().Select(p => new PigletsDTO
                {
                    Id_Piglet = p.Id_Piglet,
                    Name_Piglet = p.Name_Piglet,
                    Weight_Initial = p.Weight_Initial,
                    Acum_Weight = p.Acum_Weight,
                    Fec_Birth = p.Fec_Birth,
                    Sex_Piglet = p.Sex_Piglet,
                    Placa_Sena = p.Placa_Sena,
                    Sta_Date = p.Sta_Date ?? DateTime.Now,
                    Des_Corral = p.corral?.Des_Corral,
                    Nam_Race = p.race?.Nam_Race,
                    Name_Stage = p.stage?.Name_Stage,
                    Is_Active = p.Is_Active
                }).ToList();

                return Ok(piglets);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("GetActivePigletsForSelect")]
        public ActionResult<IEnumerable<object>> GetActivePigletsForSelect()
        {
            try
            {
                // Solo devolver los campos necesarios para selects/dropdowns
                var piglets = _Services.GetActivePiglets().Select(p => new
                {
                    Id_Piglet = p.Id_Piglet,
                    Name_Piglet = p.Name_Piglet,
                    Acum_Weight = p.Acum_Weight,
                    Des_Corral = p.corral?.Des_Corral,
                    Name_Stage = p.stage?.Name_Stage
                }).ToList();

                return Ok(piglets);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

    }
}
