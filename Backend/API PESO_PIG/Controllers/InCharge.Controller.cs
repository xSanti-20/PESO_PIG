using Microsoft.AspNetCore.Mvc;
using PESO_PIG.Models;
using System.Security.Cryptography.X509Certificates;

namespace PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class InChargeController : Controller
    {

        [HttpPost("CreateInCharge")]
        public IActionResult Create(InChargeModels inCharge)
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
        [HttpGet("GetInCharge")]
        public IActionResult GetInCharge()
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
    
        [HttpGet("GetInCharges")]
        public IActionResult GetInCharges()
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
        [HttpPost("UpdateInCharge")]
            
        public IActionResult UpdateInCharge(InChargeModels inCharge)
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
        [HttpDelete("DeleteInCharge")]
        public IActionResult DeleteInCharge()
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
