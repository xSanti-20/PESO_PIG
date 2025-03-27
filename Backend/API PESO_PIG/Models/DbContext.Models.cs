using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Corral> Corrals { get; set; }
    public DbSet<Feeding> Feedings { get; set; }
    public DbSet<Food> Foods { get; set; }
    public DbSet<Piglet> Piglets { get; set; }
    public DbSet<Entries> Entries { get; set; }
    public DbSet<Race> Races { get; set; }
    public DbSet<Stage> Stages { get; set; }
    public DbSet<Weighing> Weighings { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 23)));
        }
    }
}
