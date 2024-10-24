using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class WeighingController : Controller
    {
        public IConfiguration _Configuration;
        public readonly WeighingServices _Services;
        public UserFunction GeneralFunction;
        public WeighingController(IConfiguration configuration, WeighingServices weighingServices)
        {
            _Configuration = configuration;
            _Services = weighingServices;
            GeneralFunction = new UserFunction(configuration);
        }

        // Crear Pesaje
        [HttpPost("CreatePesaje")]
        public IActionResult Add(Weighing entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok("Pesaje creado con éxito.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar todos los Pesajes
        [HttpGet("ConsultAllPesajes")]
        public ActionResult<IEnumerable<Weighing>> GetWeighings()
        {
            try
            {
                return Ok(_Services.GetWeighings());
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar Pesaje por ID
        [HttpGet("GetPesajeId")]
        public async Task<IActionResult> GetWeighingId(int id_Weighings)
        {
            try
            {
                var weighing = await _Services.GetWeighingId(id_Weighings);

                if (weighing == null)
                {
                    return NotFound("Pesaje no existe en la BD.");
                }

                return Ok(weighing);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar rango de Pesajes
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<Weighing>> GetWeighingsRange(int start, int end)
        {
            try
            {
                var range = _Services.GetWeighings().Skip(start - 1).Take(end - start + 1).ToList();

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

        // Eliminar Pesaje por ID
        [HttpDelete("DeletePesaje")]
        public async Task<IActionResult> DelWeighing(int id_Weighings)
        {
            try
            {
                var result = await _Services.DelWeighing(id_Weighings);
                if (result)
                {
                    return Ok("Pesaje eliminado correctamente.");
                }
                return NotFound("El pesaje no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar Pesaje
        [HttpPut("UpdatePesaje")]
        public async Task<IActionResult> UpdateWeighing(Weighing updatedWeighing)
        {
            if (updatedWeighing == null)
            {
                return BadRequest("El pesaje no es válido.");
            }

            try
            {
                var result = await _Services.UpdateWeighing(updatedWeighing.id_Weighings, updatedWeighing);

                if (!result)
                {
                    return NotFound("Pesaje no existe en la BD.");
                }

                return Ok("Pesaje actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
