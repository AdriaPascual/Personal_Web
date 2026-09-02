using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;

namespace PersonalWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IEmailService emailService, ILogger<ContactController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        /// <summary>
        /// Envía un mensaje de contacto
        /// </summary>
        /// <param name="message">Datos del mensaje</param>
        /// <returns>Confirmación del envío</returns>
        [HttpPost]
        [EnableRateLimiting("contact")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendMessage([FromBody] ContactMessage message)
        {
            // [ApiController] valida el ModelState (incluidas las DataAnnotations de
            // ContactMessage: Required, EmailAddress, StringLength) automáticamente
            // antes de que la acción se ejecute.
            try
            {
                message.SentDate = DateTime.UtcNow;
                var success = await _emailService.SendContactMessageAsync(message);

                if (success)
                {
                    _logger.LogInformation("Contact message sent successfully from {Email}", message.Email);
                    return Ok(new { message = "Message sent successfully" });
                }
                else
                {
                    _logger.LogWarning("Failed to send contact message from {Email}", message.Email);
                    return StatusCode(500, new { message = "Failed to send message" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending contact message from {Email}", message.Email);
                return StatusCode(500, new { message = "An error occurred while sending the message" });
            }
        }
    }
}