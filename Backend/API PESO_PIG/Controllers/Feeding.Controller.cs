using MiApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MiApi.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FeedingController : ControllerBase
    {
        [HttpPost("CreateFeeding")]
        public IActionResult CreateAlimentacion([FromBody] AlimentacionModel alimentacion)
        {
            try
            {
                // Lógica para crear una nueva alimentación
                return Ok(new { message = "Alimentación creada con éxito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAlimentaciones")]
        public IActionResult GetAlimentaciones()
        {
            try
            {
                // Lógica para obtener todas las alimentaciones
                return Ok(new { message = "Lista de alimentaciones" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAlimentacion/{id}")]
        public IActionResult GetAlimentacion(int id)
        {
            try
            {
                // Lógica para obtener una alimentación específica
                return Ok(new { message = $"Alimentación con ID {id} obtenida" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("UpdateAlimentacion")]
        public IActionResult UpdateAlimentacion([FromBody] AlimentacionModel alimentacion)
        {
            try
            {
                // Lógica para actualizar una alimentación existente
                return Ok(new { message = "Alimentación actualizada con éxito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("DeleteAlimentacion/{id}")]
        public IActionResult DeleteAlimentacion(int id)
        {
            try
            {
                // Lógica para eliminar una alimentación
                return Ok(new { message = $"Alimentación con ID {id} eliminada" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
