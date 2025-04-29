using API_PESO_PIG.Functions;
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

// Configuración de la base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 23)))
);

// Registrar los servicios en el orden correcto para evitar dependencias circulares
// Primero registramos WeighingServices
builder.Services.AddScoped<WeighingServices>();

// Luego registramos PigletServices
builder.Services.AddScoped<PigletServices>();

// Mantener el resto de los servicios como están
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<FoodServices>();
builder.Services.AddScoped<CorralServices>();
builder.Services.AddScoped<FeedingServices>();
builder.Services.AddScoped<RaceServices>();
builder.Services.AddScoped<StageServices>();
builder.Services.AddScoped<EntriesServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Asegúrate de agregar el middleware de routing y autenticación en el orden correcto
app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Mapea los controladores
app.MapControllers();

app.Run();
