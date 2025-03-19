using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Entries
    {
        [Key]
        public int id_Entries { get; set; }
        public int Vlr_Entries { get; set; }
        public DateTime Fec_Entries { get; set; }
        public DateTime Fec_Expiration { get; set; }
        public int Can_Food { get; set; }

        public int Id_Food { get; set; }

        [ForeignKey("Id_Food")]
        public Food? food { get; set; }

    }
}