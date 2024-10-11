using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_PESO_PIG.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UserController : Controller
    {
        public IConfiguration _Configuration;
        public readonly UserServices _Services;
        public Jwt Jwt { get; set; }
        public UserFunction GeneralFunction;
        public UserController(IConfiguration configuration, UserServices userservices)
        {
            _Configuration = configuration;
            _Services = userservices;
            GeneralFunction = new UserFunction(configuration);
            Jwt = _Configuration.GetSection("Jwt").Get<Jwt>();
        }

        //peticion para logeo

        [HttpPost("Login")]
        public IActionResult Login(LoginUser login)
        {
            try
            {
                var key = Encoding.UTF8.GetBytes(Jwt.Key);


                ClaimsIdentity subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("User", login.Email)
                });

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = subject,
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(Jwt.JwtExpireTime)),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature
                        )
                };
                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);


                return Ok(new JwtSecurityTokenHandler().WriteToken(token));

            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString);
            }
        }
        [HttpPost("ResetPassUser")]
        public async Task<IActionResult> ResetPassword(User user)
        {
            try
            {
                var userExist = await _Services.GetUserEmail(user.Email);
                if (userExist != null) {

                    UserFunction funciones = new UserFunction(_Configuration);
                    var response = await funciones.SendEmail(user.Email);
                    var messageConcat = funciones.ConcatMessage(user.Email);
                    return Ok(messageConcat);
                }

                return BadRequest("El Correo no fue encontrado");

            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("CreateUser")]
        public IActionResult Add(User entity)
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


        [HttpGet("ConsultAllUser")]
        public ActionResult<IEnumerable<User>> AllUsers()
        {
            try
            {
                return Ok(_Services.GetUsers());
            }
            
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetUserId")]
        public async Task<IActionResult> GetUserId(int id_Users)
        {
            try
            {
                var user = await _Services.GetUserId(id_Users);

                if (user == null)
                {
                    return NotFound("Usuario no existe en la BD.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DelUserS(int id_Users)
        {
            try
            {
                var result = await _Services.DelUsers(id_Users);
                if (result)
                {
                    return Ok("Usuario eliminado correctamente.");
                }
                return NotFound("El usuario no fue encontrado.");
            }

            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(int id_Users, User updatedUser)
        {
            if (updatedUser == null || id_Users != updatedUser.id_Users)
            {
                return BadRequest("El usuario no es válido.");
            }

            try
            {
                var result = await _Services.UpdateUser(id_Users, updatedUser);

                if (!result)
                {
                    return NotFound("Usuario no existe en la BD.");
                }

                return Ok("Usuario actualizado correctamente.");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }
    }
}
    
