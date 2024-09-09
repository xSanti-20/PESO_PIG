using System.Collections.Generic;

namespace API_PESO_PIG.Models
{
    public class Weighing
    {
        public string Id_Weighing { get; set; }
        public int Weighing_former {  get; set; }
        public int Weighing_current {  get; set; }
        public int Weight_gain { get; set; }
        public DateTime Fec_Weighing { get; set; }
    }
}
