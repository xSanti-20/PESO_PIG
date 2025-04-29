using API_PESO_PIG.DTOs;
using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
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

        [HttpPost("CreatePiglet")]
        public IActionResult Add(Piglet entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "Piglet creado con éxito." });

            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar todos los Piglets
        [HttpGet("ConsultAllPiglets")]

        public ActionResult<IEnumerable<PigletsDTO>> GetPiglets()
        {
            var piglets = _Services.GetPiglets().Select(p => new PigletsDTO
            {
                Id_Piglet = p.Id_Piglet,
                Name_Piglet = p.Name_Piglet,
                Acum_Weight = p.Acum_Weight,
                Fec_Birth = p.Fec_Birth,
                Weight_Initial = p.Weight_Initial,
                Sex_Piglet = p.Sex_Piglet,
                Placa_Sena = p.Placa_Sena,
                Nam_Race = p.race.Nam_Race,
                Name_Stage = p.stage.Name_Stage,
                Des_Corral = p.corral.Des_Corral 
            }).ToList();

            return Ok(piglets);
        }




        // Consultar Piglet por ID
        [HttpGet("GetPigletId")]
        public async Task<IActionResult> GetPigletId(int id_Piglet)
        {
            try
            {
                var piglet = await _Services.GetPigletId(id_Piglet);

                if (piglet == null)
                {
                    return NotFound("Piglet no existe en la BD.");
                }

                return Ok(piglet);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar rango de Piglets
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<Piglet>> GetPigletsRange(int start, int end)
        {
            try
            {
                var range = _Services.GetPiglets()
                    .Skip(start - 1)
                    .Take(end - start + 1)
                    .ToList();

                if (!range.Any())
                {
                    return NotFound("No se encontraron Piglets en el rango.");
                }

                return Ok(range);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Eliminar Piglet por ID
        [HttpDelete("DeletePiglet")]
        public async Task<IActionResult> DelPiglet(int id_Piglet)
        {
            try
            {
                var result = await _Services.DelPiglet(id_Piglet);
                if (result)
                {
                    return Ok("Piglet eliminado correctamente.");
                }
                return NotFound("El Piglet no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar Piglet
        [HttpPut("UpdatePiglet")]
        public async Task<IActionResult> UpdatePiglet(Piglet updatedPiglet)
        {
            if (updatedPiglet == null)
            {
                return BadRequest("El Piglet no es válido.");
            }

            try
            {
                var result = await _Services.UpdatePiglet(updatedPiglet.Id_Piglet, updatedPiglet);

                if (!result)
                {
                    return NotFound("Piglet no existe en la BD.");
                }

                return Ok("Piglet actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }
    }
}
