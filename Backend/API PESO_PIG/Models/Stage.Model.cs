using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Stage
    {
        [Key]
        public int id_Stage {  get; set; }
        public string Name_Stage { get; set; }
        public DateTime Date_Stage { get; set; }
        public string Week_Stage {  get; set; }
    }
}
