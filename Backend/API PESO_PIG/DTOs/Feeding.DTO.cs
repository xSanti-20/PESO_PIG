using System.ComponentModel.DataAnnotations;
namespace API_PESO_PIG.DTOs
{
    public class FeedingDTO
    {
        public int id_Feeding { get; set; }
        public int Can_Feeding { get; set; }
        public string Des_Feeding { get; set; }
        public int Con_Average  {get; set; }
        public string Nom_Users { get; set; }
        public string Name_Piglet { get; set; }
        public string Nam_Food { get; set;}
        }
}
