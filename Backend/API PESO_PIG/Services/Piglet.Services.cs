using API_PESO_PIG.Models;

namespace API_PESO_PIG.Services
{
    public class PigletServices
    {
        private readonly AppDbContext _context;
        public PigletServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<Piglet>GetPiglets()
        {
            return _context.Piglets.ToList();
        }
        public void Add(Piglet entity)
        {
            _context.Piglets.Add(entity);
            _context.SaveChanges();
        }
    }
}