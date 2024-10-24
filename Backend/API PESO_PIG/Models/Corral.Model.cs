using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Corral
    {
        [Key]
        public int id_Corral { get; set; }
        public string Des_Corral { get; set; }
    }
}
