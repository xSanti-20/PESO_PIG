using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Piglet
    {
        [Key]
        public int Id_Piglet { get; set; }
        public string Name_Piglet { get; set; }
        public int Cha_Piglet { get; set; }
        public DateTime Fec_Birth { get; set; }
        public int Weight_Initial {  get; set; }
        public string Sex_Piglet { get; set; }

    }
}