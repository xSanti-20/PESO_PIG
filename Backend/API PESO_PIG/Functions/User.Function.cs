using API_PESO_PIG.Models;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace API_PESO_PIG.Functions
{
    public class UserFunction
    {
        public ConfigServer ConfigServer { get; set; }
        public UserFunction(IConfiguration configuration)
        {
            ConfigServer = configuration.GetSection("ConfigServerEmail").Get<ConfigServer>();
        }
        public MessageConcat ConcatMessage(string Email)
        {
            MessageConcat messageConcat = new MessageConcat();
            messageConcat.Message = "Correo enviado al Email: " + Email;
            return messageConcat;
        }

        public async Task<ResponseSend> SendEmail(string EmailDestinatation)
        {
            ResponseSend responseSend = new ResponseSend();
            try
            {
                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = ConfigServer.HostName;
                smtpClient.Port = ConfigServer.PortHost;
                smtpClient.Credentials = new NetworkCredential(ConfigServer.Email, ConfigServer.Password);
                smtpClient.EnableSsl = true;
                MailAddress remitente = new MailAddress(ConfigServer.Email,"PROYECTO PESO PIG",Encoding.UTF8);
                MailAddress destinatario = new MailAddress(EmailDestinatation);
                MailMessage message = new MailMessage(remitente, destinatario);

                message.Subject = "PRUEBA ENVIO CORREO ADSO";
                message.IsBodyHtml = true;
                message.Body = "<html><body><h1>Esta Es una prueba de Envio</h1><h2>Prueba hecha por Santiago Puentes</h2></body></html>";

                await smtpClient.SendMailAsync(message);


            }
            catch (Exception ex)
            {
                Addlog(ex.ToString());
                responseSend.Message = ex.Message;
                responseSend.Status = false;

            }

            return responseSend;
        }
        public void Addlog(string newlog)
        {
            string Carpetalog = AppDomain.CurrentDomain.BaseDirectory + "Logs//";
            if (!Directory.Exists(Carpetalog))
            {
                Directory.CreateDirectory(Carpetalog);
            }

            string Ruta = Carpetalog + AppDomain.CurrentDomain.FriendlyName + "_" + DateTime.Now.ToString("dd-MM-yyyy") + ".Log";
            var Registro = DateTime.Now + " - " + newlog + "\n";
            var bytsnewlog = new UTF8Encoding(true).GetBytes(Registro);
            using (FileStream log = File.Open(Ruta, FileMode.Append))
            {
                log.Write(bytsnewlog, 0, bytsnewlog.Length);
            }
        }
    }
}
