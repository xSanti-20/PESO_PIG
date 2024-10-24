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
    public class FeedingController : Controller
    {
        public IConfiguration _Configuration;
        public readonly FeedingServices _Services;
        public UserFunction GeneralFunction;

        public FeedingController(IConfiguration configuration, FeedingServices feedingServices)
        {
            _Configuration = configuration;
            _Services = feedingServices;
            GeneralFunction = new UserFunction(configuration);
        }

        // Crear Feeding
        [HttpPost("CreateFeeding")]
        public IActionResult Add(Feeding entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok("Feeding creado con éxito.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar todos los Feedings
        [HttpGet("ConsultAllFeedings")]
        public ActionResult<IEnumerable<Feeding>> GetFeedings()
        {
            try
            {
                return Ok(_Services.GetFeedings());
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar Feeding por ID
        [HttpGet("GetFeedingId")]
        public async Task<IActionResult> GetFeedingId(int id_Feeding)
        {
            try
            {
                var feeding = await _Services.GetFeedingById(id_Feeding);

                if (feeding == null)
                {
                    return NotFound("Feeding no existe en la BD.");
                }

                return Ok(feeding);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar rango de Feedings
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<Feeding>> GetFeedingsRange(int start, int end)
        {
            try
            {
                var range = _Services.GetFeedings().Skip(start - 1).Take(end - start + 1).ToList();

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

        // Eliminar Feeding por ID
        [HttpDelete("DeleteFeeding")]
        public async Task<IActionResult> DelFeeding(int id_Feeding)
        {
            try
            {
                var result = await _Services.DelFeeding(id_Feeding);
                if (result)
                {
                    return Ok("Feeding eliminado correctamente.");
                }
                return NotFound("El feeding no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar Feeding
        [HttpPut("UpdateFeeding")]
        public async Task<IActionResult> UpdateFeeding(Feeding updatedFeeding)
        {
            if (updatedFeeding == null)
            {
                return BadRequest("El feeding no es válido.");
            }

            try
            {
                var result = await _Services.UpdateFeeding(updatedFeeding.id_Feeding, updatedFeeding);

                if (!result)
                {
                    return NotFound("Feeding no existe en la BD.");
                }

                return Ok("Feeding actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }
    }
}