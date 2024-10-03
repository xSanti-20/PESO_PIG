using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class WeighingController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public WeighingController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }

        [HttpPost("CreatePesaje")]
        public IActionResult CreatePesaje(Weighing weighing)
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

        [HttpGet("ConsultPesaje")]
        public IActionResult ConsultPesaje(Weighing weighing)
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

        [HttpGet("ConsultPesajes")]
        public async Task<IActionResult>ConsultPesajes(Weighing weighing)
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


        [HttpPost("UpdatePesaje")]
        public IActionResult UpdatePesaje(Weighing weighing)
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

        [HttpDelete("DelPesaje")]
        public IActionResult DelPesaje(Weighing weighing)
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
