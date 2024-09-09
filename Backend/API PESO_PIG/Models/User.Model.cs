namespace API_PESO_PIG.Models
{
    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ResetPassUser
    {
        public string Email { get; set; }
    }
    public class User
    {
        //TODO LOS CAMPOS DE LA BASE DE DATOS
    }

    public class MessageConcat
    {
        public string Message { get; set; }
    }
}
