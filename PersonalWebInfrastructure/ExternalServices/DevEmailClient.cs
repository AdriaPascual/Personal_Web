using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;
using Microsoft.Extensions.Logging;

namespace PersonalWebInfrastructure.ExternalServices;

/// <summary>
/// Email stub for Development — writes to the logger instead of calling SendGrid.
/// Registered automatically when ASPNETCORE_ENVIRONMENT=Development.
/// </summary>
public class DevEmailClient : IEmailService
{
    private readonly ILogger<DevEmailClient> _logger;

    public DevEmailClient(ILogger<DevEmailClient> logger) => _logger = logger;

    public Task<bool> SendContactMessageAsync(ContactMessage message)
    {
        _logger.LogInformation(
            """
            ──── [DEV EMAIL] ────────────────────────────────
            To      : {ToEmail} (would be your from-email)
            Reply-To: {ReplyTo} <{Name}>
            Subject : Nuevo mensaje de contacto: {Subject}
            Date    : {SentDate:dd/MM/yyyy HH:mm}
            Message :
            {Message}
            ─────────────────────────────────────────────────
            """,
            "(SendGrid:FromEmail not needed in dev)",
            message.Email,
            message.Name,
            message.Subject,
            message.SentDate,
            message.Message);

        return Task.FromResult(true);
    }
}
