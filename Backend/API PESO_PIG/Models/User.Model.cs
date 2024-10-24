using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API_PESO_PIG.Models
{
    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class User
    {
        [Key]
        public int id_Users { get; set; }

        [DisplayName("Nombre Usuario")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un limite de caracteres de {1}")]
        public string Nom_Users { get; set; }

        [DisplayName("Tipo Usuario")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un limite de caracteres de {1}")]
        public string Tip_Users { get; set; }

        [DisplayName("Correo")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un limite de caracteres de {1}")]
        public string Email { get; set; }

        [DisplayName("Bloqueo")]
        public bool Blockade { get; set; }

        [DisplayName("Token de Usuario")]
        [StringLength(200, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        public string Token { get; set; }

        [DisplayName("Intentos")]
        [Range(0, 10, ErrorMessage = "El campo {0} debe estar entre {1} y {2}")]
        public int Attempts { get; set; }
    }

    public class MessageConcat
    {
        public string Message { get; set; }
    }
}