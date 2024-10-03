using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;
using API_PESO_PIG.Functions;


namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class RaceController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public RaceController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }
        [HttpPost("CreateRace")]
        public IActionResult CreateRace(RaceModel raceModel)
        {
            try
            {
                // Lógica para crear una carrera
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("GetRace")]
        public IActionResult GetRace(RaceModel raceModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("UpdateRace")]
        public IActionResult UpdateRace(RaceModel raceModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("DeleteRace")]
        public IActionResult DeleteRace(RaceModel raceModel)
        {
            try
            {
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