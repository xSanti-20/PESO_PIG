using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class PigletController : Controller
    {
        public UserFunction GeneralFunction;
        public PigletController(IConfiguration configuration)
        {
            GeneralFunction = new UserFunction(configuration);
        }

        [HttpPost("CreateLechon")]
        public IActionResult CreateLechon(Piglet piglet)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());

            }
        }

        [HttpGet("ConsultLechon")]
        public IActionResult ConsultLechon(Piglet piglet)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());

            }
        }

        [HttpGet("ConsultLechones")]
        public IActionResult ConsultLechones(Piglet piglet)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());

            }
        }


        [HttpPost("UpdateLechon")]
        public IActionResult UpdateLechon(Piglet piglet)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());

            }
        }

        [HttpDelete("DeleteLechon")]
        public IActionResult DeleteLechon(Piglet piglet)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());

            }
        }
    }
}
