using API_PESO_PIG.Functions;
using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class CorralController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public CorralController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }

        [HttpPost("CreateCorral")]
        public IActionResult CreateCorral(CorralModel corralModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message.ToString());
            }        
        }
        [HttpGet("GetCorrales")]
        public IActionResult GetCorrales(CorralModel corralModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message.ToString());
            }
           
        }
        [HttpGet("GetCorral")]
        public IActionResult GetCorral(CorralModel corralModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message.ToString());
            }
            
        }
        [HttpPut("UpdateCorral")]
        public IActionResult UpdateEtapa(CorralModel corralModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message.ToString());
            }
            
        }
        [HttpDelete("DeleteCorral")]
        public IActionResult DeleteCorral(CorralModel corralModel)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.Message.ToString());

            }
            
        }
    }
}
