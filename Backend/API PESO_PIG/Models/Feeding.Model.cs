using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Feeding
    {
        [Key]
        public int id_Feeding { get; set; }
        public int Can_Feeding { get; set; }
        public DateTime Fed_Feeding { get; set; }
        public string Tip_Feeding { get; set; }
        public int Con_Average { get; set; }

        //foránea a la tabla Users
        public int id_Users { get; set; }

        [ForeignKey("Id_User")]
        public User user { get; set; }

        //foránea a la tabla Piglets
        public int Id_Piglet { get; set; }

        [ForeignKey("Id_Piglet")]
        public Piglet piglet { get; set; }

        //foránea a la tabla Foods
        public int Id_Food { get; set; }

        [ForeignKey("Id_Food")]
        public Food food { get; set; }
    }
}


