using System.ComponentModel.DataAnnotations;
namespace API_PESO_PIG.DTOs
{
    public class WeighingDTO
    {
        public int Id_Weighing { get; set; }
        public int Weighing_Current { get; set; }
        public int Weight_Gain { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fec_Weighing { get; set; }
        public string Name_Piglet { get; set; }
        public string Nom_Users { get; set; }

    }
}
