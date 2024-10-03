namespace API_PESO_PIG.Models
{
    public class StageModel
    {
        public int Id_Stage {  get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Week {  get; set; }
        public int Id_Corral { get; set; } 
    }
}
