using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MiApi.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class RaceController : Controller
    {
        [HttpPost("CreateRace")]
        public IActionResult CreateRace([FromBody] RaceModel race)
        {
            try
            {
                // Lógica para crear una carrera
                return Ok(new { message = "Carrera creada con éxito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
