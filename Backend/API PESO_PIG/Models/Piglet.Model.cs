using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Piglet
    {
        [Key]
        public int Id_Piglet { get; set; }

        [DisplayName("Nombre Lechon")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        public string Name_Piglet { get; set; }

        [DisplayName("Chapeta Lechon")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [Range(1, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}")]
        public int Cha_Piglet { get; set; }

        [DisplayName("Fecha de Nacimiento")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [DataType(DataType.Date, ErrorMessage = "El campo {0} debe ser una fecha válida")]
        public DateTime Fec_Birth { get; set; }

        [DisplayName("Peso Inicial")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [Range(1, 1000, ErrorMessage = "El campo {0} debe estar entre {1} y {2}")]
        public int Weight_Initial { get; set; }

        [DisplayName("Sexo Lechon")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        public string Sex_Piglet { get; set; }
    }
}