using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.DTOs
{
    public class PigletsDTO
    {
        public int Id_Piglet { get; set; }
        public string Name_Piglet { get; set; }
        public int Acum_Weight { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fec_Birth { get; set; }
        public int Weight_Initial { get; set; }
        public string Sex_Piglet { get; set; }
        public string Nam_Race { get; set; }
        public string Name_Stage { get; set; }

    }
}
