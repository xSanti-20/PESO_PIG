using API_PESO_PIG.Middlewares;
using API_PESO_PIG.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var key = Encoding.UTF8.GetBytes("SantiagoPuentes.@ADSO2824123SENA");

//var jwtkey = builder.Configuration.GetSection("Jwt:key").Value;
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(option =>
//    {
//        option.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtkey)),
//            ValidateIssuer = false,
//            ValidateAudience = false,
//            ClockSkew = TimeSpan.Zero
//        };

//        option.Events = new JwtBearerEvents()
//        {
//            OnChallenge = context =>
//            {
//                context.HandleResponse();
//                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//                context.Response.ContentType = "application/json";

//                if (string.IsNullOrEmpty(context.Error))
//                    context.Error = "Token invalido o no autorizado";
//                if (string.IsNullOrEmpty(context.ErrorDescription))
//                    context.ErrorDescription = "Esta solicitud requiere que se proporcione un token de acceso JWT valido";

//                if(context.AuthenticateFailure != null && context.AuthenticateFailure.GetType() == typeof(SecurityTokenExpiredException))
//                {
//                    var authenticationException = context.AuthenticateFailure as SecurityTokenExpiredException;
//                    context.Response.Headers.Add("x-token-expired", authenticationException.Expires.ToString("o"));
//                    context.ErrorDescription = $"El token expiro el{authenticationException.Expires.ToString("o")}";
//                }

//                return context.Response.WriteAsync(JsonSerializer.Serialize(new
//                {
//                    error = context.Error,
//                    error_description = context.ErrorDescription
//                }));
//            }
//        };
//    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 23)))
);

builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<PigletServices>();
builder.Services.AddScoped<WeighingServices>();
builder.Services.AddScoped<FoodServices>();
builder.Services.AddScoped<CorralServices>();
builder.Services.AddScoped<FeedingServices>();
builder.Services.AddScoped<RaceServices>();
builder.Services.AddScoped<StageServices>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
//app.UseMiddleware<Middleware>();
app.MapControllers();

app.Run();