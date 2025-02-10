using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

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
    }
}