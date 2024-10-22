using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Feeding
    {
        [Key]
        public int id_Feeding { get; set; }
        public int Can_Feeding { get; set; }
        public DateTime Fed_Feeding { get; set; }
        public string Tip_Feeding { get; set; }
        public int Con_Average { get; set; }
    }
}


