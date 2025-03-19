using System.ComponentModel.DataAnnotations;
namespace API_PESO_PIG.DTOs
{
    public class FoodDTO 

    {
        public int Id_Food { get; set; }
        public string Nam_Food { get; set; }
        public string Des_Food { get; set; }
        public int Existence { get; set; }
        public int Vlr_Unit { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fec_Expiration { get; set; }
        public string Und_Extent { get; set; }
        public string Name_Stage { get; set; }
 

    }
}
