using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FeedingController : ControllerBase
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public FeedingController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }
        [HttpPost("CreateFeeding")]
        public IActionResult CreateAlimentacion(Feeding feedingModel)
        {
            try
            {
                // Lógica para crear una nueva alimentación
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAlimentaciones")]
        public IActionResult GetAlimentaciones(Feeding feedingModel)
        {
            try
            {
                // Lógica para obtener todas las alimentaciones
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAlimentacion")]
        public IActionResult GetAlimentacion()
        {
            try
            {
                // Lógica para obtener una alimentación específica
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("UpdateAlimentacion")]
        public IActionResult UpdateAlimentacion(Feeding feedingModel)
        {
            try
            {
                // Lógica para actualizar una alimentación existente
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("DeleteAlimentacion")]
        public IActionResult DeleteAlimentacion(Feeding feedingModel)
        {
            try
            {
                // Lógica para eliminar una alimentación
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }
    }
}
