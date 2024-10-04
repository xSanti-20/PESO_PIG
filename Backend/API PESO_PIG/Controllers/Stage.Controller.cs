using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;
using API_PESO_PIG.Functions;

namespace PESOPIG.Controllers
{
    [ApiController]
    [Route("Api/controller")]
    public class StageController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public StageController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }
        [HttpPost("CreateStage")]
        public IActionResult CreateStage(Stage stage)
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
        [HttpGet("GetStages")]
        public IActionResult GetStages(Stage stageModel)
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
        [HttpGet("GetEtapa")]
        public IActionResult GetStage(Stage stageModel)
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
        [HttpPost("UpdateEtapa")]
        public IActionResult UpdateStage(Stage Stage)
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
        [HttpDelete("DeleteStage")]
        public IActionResult DeleteStage(Stage stageModel)
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
