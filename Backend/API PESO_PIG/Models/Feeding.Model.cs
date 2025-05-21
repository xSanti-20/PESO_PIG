
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Feeding
    {
        internal object corral;

        [Key]
        public int id_Feeding { get; set; }

        public string Obc_Feeding { get; set; }  // Observaciones

        public int Can_Food { get; set; }        // Cantidad de alimento (unidad complementaria)

        public int Sum_Food { get; set; }        // Suma total de alimento consumido


        // Foránea a la tabla Users
        public int id_Users { get; set; }

        [ForeignKey("id_Users")]
        public User? user { get; set; }

        // Foránea a la tabla Piglets
        public int id_Corral { get; set; }

        [ForeignKey("id_Corral")]
        public Corral? Corral { get; set; }

        // Foránea a la tabla Foods
        public int id_Food { get; set; }

        [ForeignKey("id_Food")]
        public Food? food { get; set; }
        public DateTime Dat_Feeding { get; set; }
    }
}



