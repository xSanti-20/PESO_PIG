using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Food
    {
        [Key]
        public int id_Food { get; set; }
        public string Nam_Food { get; set; }
        public DateTime Dat_Entrance { get; set; }
        public string Des_Food { get; set; }
        public int Uni_Extent { get; set; }
        public int Can_Food { get; set; }
        public int Wor_Unitary { get; set; }
        public int Wor_Total{get; set; }
        public DateTime Dat_Maturity { get; set; }

    }
}
