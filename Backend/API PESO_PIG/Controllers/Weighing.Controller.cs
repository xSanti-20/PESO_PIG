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

        [HttpPost("CreatePesaje")]
        public IActionResult Add(Weighing entity)
        {
            try
            {
                _Services.Add(entity);
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
        public ActionResult<IEnumerable<Piglet>> GetWeighing()
        {
            try
            {
                return Ok(_Services.GetWeighing());
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
