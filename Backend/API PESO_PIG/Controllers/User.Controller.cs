using API_PESO_PIG.Functions;
using API_PESO_PIG.Models;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly AppDbContext _context;

        public UserController(IConfiguration configuration, UserServices userservices, AppDbContext context)
        {
            _Configuration = configuration;
            _Services = userservices;
            GeneralFunction = new UserFunction(configuration);
            Jwt = _Configuration.GetSection("Jwt").Get<Jwt>();
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginUser login)
        {
            try
            {
                if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                {
                    return BadRequest(new { message = "Los campos Email y Password son obligatorios." });
                }

                // Obtiene el usuario por correo electrónico
                var user = await _Services.GetUserEmail(login.Email);
                if (user == null)
                {
                    return Unauthorized(new { message = "Usuario no encontrado." });
                }

                // Verifica la contraseña
                if (!BCrypt.Net.BCrypt.Verify(login.Password + user.Salt, user.Hashed_Password))
                {
                    return Unauthorized(new { message = "Contraseña incorrecta." });
                }

                // Genera el token JWT
                var key = Encoding.UTF8.GetBytes(Jwt.Key);
                var claims = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("UserId", user.id_Users.ToString())
        });

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(Jwt.JwtExpireTime)),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                // Actualiza el token en el usuario
                user.Token = tokenString;
                await _Services.UpdateUser(user.id_Users, user);

                // Devuelve la respuesta
                return Ok(new {
                    token = tokenString,
                    username = user.Nom_Users,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                // Loguea el error para depuración
                GeneralFunction.Addlog($"Error en Login: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }



        [HttpPost("ResetPassUser")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassUser model)
        {
            try
            {
                var user = await _Services.GetByEmailAsync(model.Email);
                if (user == null)
                {
                    return NotFound(new { message = "El Correo no fue encontrado" });
                }

                var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                user.ResetToken = token;
                user.ResetTokenExpiration = DateTime.UtcNow.AddMinutes(30);
                await _Services.UpdateUserAsync(user);

                string resetLink = $"http://localhost:3000/user/reset_password?token={token}";

                var emailuser = await GeneralFunction.SendEmail(model.Email, resetLink);
                if (!emailuser.Status)
                {
                    return BadRequest(new { message = "Error al Enviar el Correo" });
                }

                return Ok(new { message = "Correo Enviado Correctamente" });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("ResetPasswordConfirm")]
        public async Task<IActionResult> ResetPasswordConfirm([FromBody] ResetPassUsers model)
        {
            try
            {
                // Primero, buscar al usuario por el token de restablecimiento en lugar del correo electrónico
                var user = await _Services.GetByTokenAsync(model.Token); // Método que deberías tener en tu servicio para buscar por token.

                if (user == null || user.ResetTokenExpiration < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Token inválido o expirado." });
                }

                // Hashear la nueva contraseña
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.Hashed_Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword + salt);
                user.Salt = salt;

                // Borrar el token usado
                user.ResetToken = null;
                user.ResetTokenExpiration = null;
                await _Services.GetResponsibleByResetToken(user.ResetToken);

                return Ok(new { message = "Contraseña restablecida correctamente." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("validatepass")]
        public async Task<IActionResult> ValidateToken([FromBody] TokenRequest model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.Token))
                {
                    return BadRequest(new { message = "Token no proporcionado" });
                }

                // Decodificar el token desde Base64 a string
                string decodedToken;
                try
                {
                    byte[] tokenBytes = Convert.FromBase64String(model.Token);
                    decodedToken = Encoding.UTF8.GetString(tokenBytes);
                }
                catch (FormatException)
                {
                    return Unauthorized(new { message = "Formato de token inválido" });
                }

                // Buscar el usuario con ese token
                var user = await _Services.GetByTokenAsync(model.Token);
                if (user == null || user.ResetTokenExpiration < DateTime.UtcNow)
                {
                    return Unauthorized(new { message = "Token invalido o expirado" });
                }

                return Ok(new { message = "Token valido" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("CreateUser")]
        public IActionResult Add(User entity)
        {
            try
            {
                // Generar salt
                string salt = BCrypt.Net.BCrypt.GenerateSalt();

                // Hashear la contraseña
                entity.Hashed_Password = BCrypt.Net.BCrypt.HashPassword(entity.Hashed_Password + salt);
                entity.Salt = salt;
                entity.Token = ""; // Se inicializa el token en vacío por ahora

                // Agregar el usuario
                _Services.Add(entity);

                return Ok(new { message = "Usuario creado con éxito" });
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
        [Authorize]
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
        [HttpPost("ConsultRange")]
        public ActionResult<IEnumerable<User>> GetAllRange(int start, int end)
        {
            try
            {
                if (end < 0)
                {
                    return BadRequest("El parámetro 'end' no puede ser negativo.");
                }
                if (start > end)
                {
                    return BadRequest("El valor de 'star' no puede ser mayor que 'end'.");
                }

                var range = _Services.GetUsers()
                    .Skip(start - 1)
                    .Take(end - start + 1)
                    .ToList();

                if (!range.Any())
                {
                    return NotFound("No se encontraron los usuarios en el rango.");
                }

                return Ok(range);
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
        public async Task<IActionResult> UpdateUser(User updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("El usuario no es válido.");
            }

            try
            {
                var result = await _Services.UpdateUser(updatedUser.id_Users, updatedUser);

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
