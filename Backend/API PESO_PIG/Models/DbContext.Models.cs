using API_PESO_PIG.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
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
            optionsBuilder.UseMySql("Server=localhost;Database=peso_pig;User=root;Password=Santiago04200;",
            new MySqlServerVersion(new Version(8, 0, 23)));
        }   
    }
}