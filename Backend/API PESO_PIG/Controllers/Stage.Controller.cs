using Microsoft.AspNetCore.Mvc;
using PESOPIG.Models;

namespace PESOPIG.Controllers
{
    [ApiController]
    [Route("Api/controller")]
    public class StageController : Controller
    {
        [HttpPost("CreateStage")]
        public IActionResult CreateStage
            (StageModel stage)
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
        [HttpGet("GetStages")]
        public IActionResult GetStages()
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
        [HttpGet("GetEtapa")]
        public IActionResult GetStage()
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
        [HttpPost("UpdateEtapa")]
        public IActionResult UpdateStage(StageModel Stage)
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
        [HttpDelete("DeleteStage")]
        public IActionResult DeleteStage()
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
