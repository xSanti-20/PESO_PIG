using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CorralController : Controller
    {
        public IConfiguration _Configuration;
        public readonly CorralServices _Services;
        public UserFunction GeneralFunction;

        public CorralController(IConfiguration configuration, CorralServices corralServices)
        {
            _Configuration = configuration;
            _Services = corralServices;
            GeneralFunction = new UserFunction(configuration);
        }

        // Crear Corral
        [HttpPost("CreateCorral")]
        public IActionResult Add(Corral entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok("Corral creado con éxito.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar todos los Corrales
        [HttpGet("ConsultAllCorrales")]
        public ActionResult<IEnumerable<Corral>> GetCorrales()
        {
            try
            {
                return Ok(_Services.GetCorrals());
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar Corral por ID
        [HttpGet("GetCorralId")]
        public async Task<IActionResult> GetCorralId(int id_Corral)
        {
            try
            {
                var corral = await _Services.GetCorralById(id_Corral);

                if (corral == null)
                {
                    return NotFound("Corral no existe en la BD.");
                }

                return Ok(corral);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar rango de Corrales
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<Corral>> GetCorralsRange(int start, int end)
        {
            try
            {
                var range = _Services.GetCorrals().Skip(start - 1).Take(end - start + 1).ToList();

                if (!range.Any())
                {
                    return NotFound("No se encontraron pesajes en el rango.");
                }

                return Ok(range);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Eliminar Corral por ID
        [HttpDelete("DeleteCorral")]
        public async Task<IActionResult> DelCorral(int id_Corral)
        {
            try
            {
                var result = await _Services.DelCorral(id_Corral);
                if (result)
                {
                    return Ok("Corral eliminado correctamente.");
                }
                return NotFound("El corral no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar Corral
        [HttpPut("UpdateCorral")]
        public async Task<IActionResult> UpdateCorral(Corral updatedCorral)
        {
            if (updatedCorral == null)
            {
                return BadRequest("El corral no es válido.");
            }

            try
            {
                var result = await _Services.UpdateCorral(updatedCorral.id_Corral, updatedCorral);

                if (!result)
                {
                    return NotFound("Corral no existe en la BD.");
                }

                return Ok("Corral actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }
    }
}