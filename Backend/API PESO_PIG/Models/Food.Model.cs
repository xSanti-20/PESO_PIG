using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Food
    {
        [Key]
        public int id_Food { get; set; }
        public string Nam_Food { get; set; }
        public string Des_Food { get; set; }
        public int Existence { get; set; }
        public int Vlr_Unit { get; set; }
        public DateTime Fec_Expiration { get; set; }
        public string Und_Extent { get; set; }


        //foránea a la tabla Stages
        public int id_Stage { get; set; }

        [ForeignKey("id_Stage")]
        public Stage? stage { get; set; }
    }
}
