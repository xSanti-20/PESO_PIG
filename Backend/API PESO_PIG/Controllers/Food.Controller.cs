using API_PESO_PIG.Functions;
using Microsoft.AspNetCore.Mvc;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Authorization;

namespace PESO_PIG.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FoodController : Controller
    {
        public IConfiguration _Configuration;
        public readonly FoodServices _Services;
        public UserFunction GeneralFunction;

        public FoodController(IConfiguration configuration, FoodServices foodServices)
        {
            _Configuration = configuration;
            _Services = foodServices;
            GeneralFunction = new UserFunction(configuration);
        }

        // Crear Food
        [HttpPost("CreateFood")]
        public IActionResult Add(Food entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "Food creado con éxito." });

            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar todos los Foods
        [HttpGet("ConsultAllFoods")]
        public ActionResult<IEnumerable<Food>> GetFoods()
        {
            try
            {
                return Ok(_Services.GetFoods());
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar Food por ID
        [HttpGet("GetFoodId")]
        public async Task<IActionResult> GetFoodById(int id_Food)
        {
            try
            {
                var food = await _Services.GetFoodById(id_Food);

                if (food == null)
                {
                    return NotFound("Food no existe en la BD.");
                }

                return Ok(food);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Consultar rango de Foods
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<Food>> GetFoodsRange(int start, int end)
        {
            try
            {
                var range = _Services.GetFoods()
                    .Skip(start - 1)
                    .Take(end - start + 1)
                    .ToList();

                if (!range.Any())
                {
                    return NotFound("No se encontraron Foods en el rango.");
                }

                return Ok(range);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Eliminar Food por ID
        [HttpDelete("DeleteFood")]
        public async Task<IActionResult> DelFood(int id_Food)
        {
            try
            {
                var result = await _Services.DelFood(id_Food);
                if (result)
                {
                    return Ok("Food eliminado correctamente.");
                }
                return NotFound("El Food no fue encontrado.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar Food
        [HttpPut("UpdateFood")]
        public async Task<IActionResult> UpdateFood(Food updatedFood)
        {
            if (updatedFood == null)
            {
                return BadRequest("El Food no es válido.");
            }

            try
            {
                var result = await _Services.UpdateFood(updatedFood.id_Food, updatedFood);

                if (!result)
                {
                    return NotFound("Food no existe en la BD.");
                }

                return Ok("Food actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }
    }
}
