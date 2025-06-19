﻿using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Stage
    {
        [Key]
        public int id_Stage {  get; set; }
        public string Name_Stage { get; set; }
        public int Weight_From {  get; set; }
        public int Weight_Upto { get; set; }
        public int Dur_Stage { get; set; }
    }
}
