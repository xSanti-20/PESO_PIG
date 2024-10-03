using API_PESO_PIG.Functions;
using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;

namespace PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FoodController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public FoodController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }
        [HttpPost("CreateFood")]
        public IActionResult Create(FoodModels foodModels)
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
        [HttpGet("GetFood")]
        public IActionResult GetFood(FoodModels foodModels)
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

        [HttpGet("GetAllFood")]
        public IActionResult GetFoods(FoodModels foodModels)
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
        [HttpPost("UpdateFood")]

        public IActionResult UpdateFood(FoodModels foodModels)
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
        [HttpDelete("DeleteFood")]
        public IActionResult DeleteFood(FoodModels foodModels)
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


