using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class Race
    {
        [Key]
        public int id_Race { get; set; }

        [DisplayName("Nombre Raza")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        public string Nam_Race { get; set; }
    }
}
