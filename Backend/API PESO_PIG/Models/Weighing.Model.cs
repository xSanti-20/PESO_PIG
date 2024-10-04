using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Weighing
    {
        [Key]
        public int id_Weighings { get; set; }
        public int Weighing_Former {  get; set; }
        public int Weighing_Current {  get; set; }
        public int Weight_Gain { get; set; }
        public DateTime Fec_Weighing { get; set; }
    }
}