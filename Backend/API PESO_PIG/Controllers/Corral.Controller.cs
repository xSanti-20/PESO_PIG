using Microsoft.AspNetCore.Mvc;
using PESOPIG.Models;

namespace PESOPIG.Controllers
{
    [ApiController]
    [Route("Api/controller")]
    public class CorralController : Controller
    {
        [HttpPost("CreateCorral")]
        public IActionResult CreateCorral
            (CorralModel etapa)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());
            }        
        }
        [HttpGet("GetCorrales")]
        public IActionResult GetCorrales()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());
            }
           
        }
        [HttpGet("GetCorral")]
        public IActionResult GetCorral()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());
            }
            
        }
        [HttpPut("UpdateCorral")]
        public IActionResult UpdateEtapa(CorralModel Corral)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());
            }
            
        }
        [HttpDelete("DeleteCorral")]
        public IActionResult DeleteCorral()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());

            }
            
        }
    }
}
