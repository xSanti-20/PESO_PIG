using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Corral
    {
        [Key]
        public int Id_Corral { get; set; }
        public int Cha_Corral { get; set; }
    }
}
