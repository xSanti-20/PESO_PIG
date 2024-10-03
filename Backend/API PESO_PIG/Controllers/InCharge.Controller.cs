using API_PESO_PIG.Functions;
using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class InChargeController : Controller
    {
        public IConfiguration _Configuration;
        public UserFunction GeneralFunction;
        public InChargeController(IConfiguration configuration)
        {
            _Configuration = configuration;
            GeneralFunction = new UserFunction(configuration);
        }

        [HttpPost("CreateInCharge")]
        public IActionResult Create(InChargeModels inChargeModels)
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
        [HttpGet("GetInCharge")]
        public IActionResult GetInCharge(InChargeModels inChargeModels)
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
    
        [HttpGet("GetInCharges")]
        public IActionResult GetInCharges(InChargeModels inChargeModels)
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
        [HttpPost("UpdateInCharge")]
            
        public IActionResult UpdateInCharge(InChargeModels inChargeModels)
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
        [HttpDelete("DeleteInCharge")]
        public IActionResult DeleteInCharge(InChargeModels inChargeModels)
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
