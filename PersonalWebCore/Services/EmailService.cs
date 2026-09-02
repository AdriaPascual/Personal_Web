using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;

namespace PersonalWebCore.Services
{
    public class EmailService : IEmailService
    {
        public async Task<bool> SendContactMessageAsync(ContactMessage message)
        {
            // Por ahora solo simulamos el envío
            // Más adelante implementaremos con SendGrid o SMTP
            await Task.Delay(100); // Simula operación asíncrona

            // Aquí iría la lógica real de envío de email
            Console.WriteLine($"Mensaje recibido de: {message.Name} ({message.Email})");
            Console.WriteLine($"Asunto: {message.Subject}");
            Console.WriteLine($"Mensaje: {message.Message}");

            return true;
        }
    }
}