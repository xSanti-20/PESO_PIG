using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class PigletController : Controller
    {
        public IConfiguration _Configuration;
        public readonly PigletServices _Services;
        public UserFunction GeneralFunction;
        public PigletController(IConfiguration configuration, PigletServices pigletServices)
        {
            _Configuration = configuration;
            _Services = pigletServices;
            GeneralFunction = new UserFunction(configuration);
        }

        [HttpPost("CreatePiglet")]
        public IActionResult Add(Piglet entity)
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

        [HttpGet("ConsultPiglet")]
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

        [HttpGet("ConsultPiglets")]
        public ActionResult<IEnumerable<Piglet>> GetPiglets()
        {
            try
            {
                return Ok(_Services.GetPiglets());
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
