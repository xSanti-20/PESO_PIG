using System.ComponentModel.DataAnnotations;
namespace API_PESO_PIG.DTOs
{
    public class Weighing
    {
        public int Id_Weighing { get; set; }
        public int Weighing_Former { get; set; }
        public int Weighing_Current { get; set; }
        public int Weight_Gain { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fec_Birth { get; set; }
        public string Name_Piglet { get; set; }
        public string Name_User { get; set; }

    }
}
