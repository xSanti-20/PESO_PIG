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
        public int id { get; set; }
        public string Nom_Users { get; set; }
        public string Tip_Users { get; set; }
    }

    public class MessageConcat
    {
        public string Message { get; set; }
    }
}