using System.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace PersonalWebInfrastructure.ExternalServices;

public class SmtpEmailClient : IEmailService
{
    private readonly string _host;
    private readonly int    _port;
    private readonly string _user;
    private readonly string _password;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _toEmail;
    private readonly ILogger<SmtpEmailClient> _logger;

    public SmtpEmailClient(IConfiguration configuration, ILogger<SmtpEmailClient> logger)
    {
        _host      = configuration["Smtp:Host"]      ?? "smtp-relay.brevo.com";
        _port      = int.TryParse(configuration["Smtp:Port"], out var p) ? p : 587;
        _user      = configuration["Smtp:User"]      ?? throw new InvalidOperationException("Smtp:User is required.");
        _password  = configuration["Smtp:Password"]  ?? throw new InvalidOperationException("Smtp:Password is required.");
        _fromEmail = configuration["Smtp:FromEmail"] ?? _user;
        _fromName  = configuration["Smtp:FromName"]  ?? "Portfolio";
        _toEmail   = configuration["Smtp:ToEmail"]   ?? _fromEmail;
        _logger    = logger;
    }

    public async Task<bool> SendContactMessageAsync(ContactMessage message)
    {
        try
        {
            var mime = new MimeMessage();
            mime.From.Add(new MailboxAddress(_fromName, _fromEmail));
            mime.To.Add(MailboxAddress.Parse(_toEmail));

            if (!string.IsNullOrEmpty(message.Email))
                mime.ReplyTo.Add(new MailboxAddress(message.Name ?? "", message.Email));

            mime.Subject = $"Portfolio — nuevo mensaje: {message.Subject}";
            mime.Body    = new TextPart("html") { Text = BuildHtml(message) };

            // Algunos hostings (ej. Render free tier) bloquean o no completan conexiones
            // SMTP salientes; sin este timeout, ConnectAsync puede colgarse minutos en vez
            // de fallar rápido.
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));

            using var client = new SmtpClient();
            await client.ConnectAsync(_host, _port, SecureSocketOptions.StartTls, cts.Token);
            await client.AuthenticateAsync(_user, _password, cts.Token);
            await client.SendAsync(mime, cts.Token);
            await client.DisconnectAsync(quit: true, cts.Token);

            _logger.LogInformation("Email enviado desde {Sender}", message.Email);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enviando email via SMTP ({Host}:{Port})", _host, _port);
            return false;
        }
    }

    private static string BuildHtml(ContactMessage m)
    {
        var name    = WebUtility.HtmlEncode(m.Name);
        var email   = WebUtility.HtmlEncode(m.Email);
        var subject = WebUtility.HtmlEncode(m.Subject);
        var body    = WebUtility.HtmlEncode(m.Message);

        return $@"<html><body style=""font-family:Arial,sans-serif;color:#333"">
  <h2 style=""color:#e94560"">Nuevo mensaje de contacto</h2>
  <table style=""border-collapse:collapse;width:100%;max-width:600px"">
    <tr>
      <td style=""padding:8px;font-weight:bold"">Nombre</td>
      <td style=""padding:8px"">{name}</td>
    </tr>
    <tr style=""background:#f5f5f5"">
      <td style=""padding:8px;font-weight:bold"">Email</td>
      <td style=""padding:8px""><a href=""mailto:{email}"">{email}</a></td>
    </tr>
    <tr>
      <td style=""padding:8px;font-weight:bold"">Asunto</td>
      <td style=""padding:8px"">{subject}</td>
    </tr>
  </table>
  <div style=""margin-top:16px;padding:16px;background:#f9f9f9;border-left:4px solid #e94560;white-space:pre-wrap"">{body}</div>
  <p style=""color:#aaa;font-size:12px;margin-top:24px"">Enviado el {m.SentDate:dd/MM/yyyy} a las {m.SentDate:HH:mm} UTC</p>
</body></html>";
    }
}
