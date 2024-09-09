using Microsoft.AspNetCore.Mvc;
using PESO_PIG.Models;
using System.Security.Cryptography.X509Certificates;

namespace PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FoodController : Controller
    {
        [HttpPost("CreateFood")]
        public IActionResult Create(FoodModels foodModels)
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
        [HttpGet("GetFood")]
        public IActionResult GetFood()
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

        [HttpGet("GetAllFood")]
        public IActionResult GetFoods()
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
        [HttpPost("UpdateFood")]

        public IActionResult UpdateFood(FoodModels foodModels)
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
        [HttpDelete("DeleteFood")]
        public IActionResult DeleteFood()
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


