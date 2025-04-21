namespace API_PESO_PIG.Models
{
    public class Jwt
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Subject { get; set; }
        public string JwtExpireTime { get; set; }
    }
}
