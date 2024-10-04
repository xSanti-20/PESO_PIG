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
        public async Task<IActionResult> ResetPassword(ResetPassUser user)
        {
            try
            {
                UserFunction funciones = new UserFunction(_Configuration);
                var response = await funciones.SendEmail(user.Email);
                var messageConcat = funciones.ConcatMessage(user.Email);
                return Ok(messageConcat);
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
    }
}
    
