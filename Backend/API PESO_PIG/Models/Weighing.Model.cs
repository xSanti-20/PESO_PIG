using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Weighing
    {
        [Key]
        public int id_Weighings { get; set; }
        public int Weighing_Current {  get; set; }
        public int Weight_Gain { get; set; }
        public DateTime Fec_Weighing { get; set; }

        [ForeignKey("Id_Piglet")]
        public Piglet? piglet { get; set; }

        [ForeignKey("id_Users")]
        public User? user { get; set; }
    }
}