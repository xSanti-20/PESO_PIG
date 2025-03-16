using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_PESO_PIG.Models
{
    public class Piglet
    {
        [Key]
        public int Id_Piglet { get; set; }

        [DisplayName("Nombre Lechon")]
        public string Name_Piglet { get; set; }

        [DisplayName("Peso Acumulado")]
        public int Acum_Weight { get; set; }

        [DisplayName("Fecha de Nacimiento")]
        public DateTime Fec_Birth { get; set; }

        [DisplayName("Peso Inicial")]
        public int Weight_Initial { get; set; }

        [DisplayName("Sexo Lechon")]
        public string Sex_Piglet { get; set; }

        //foránea a la tabla Races
        public int Id_Race { get; set; }

        [ForeignKey("Id_Race")]
        public Race? race { get; set; }

        //foránea a la tabla Stages
        public int Id_Stage { get; set; }

        [ForeignKey("Id_Stage")]
        public Stage? stage { get; set; }

        //foránea a la tabla Corrals
        public int Id_Corral { get; set; }

        [ForeignKey("Id_Corral")]
        public Corral? corral { get; set; }
    }
}