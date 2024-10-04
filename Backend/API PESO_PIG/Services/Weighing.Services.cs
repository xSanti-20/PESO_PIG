using API_PESO_PIG.Models;

namespace API_PESO_PIG.Services
{
    public class WeighingServices
    {
        private readonly AppDbContext _context;
        public WeighingServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<Weighing> GetWeighing()
        {
            return _context.Weighings.ToList();
        }
        public void Add(Weighing entity)
        {
            _context.Weighings.Add(entity);
            _context.SaveChanges();
        }
    }
}