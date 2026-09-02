using System;
using System.ComponentModel.DataAnnotations;

namespace PersonalWebCore.Models
{
    public class ContactMessage
    {
        [Required, StringLength(100)]
        public string? Name { get; set; }

        [Required, EmailAddress, StringLength(254)]
        public string? Email { get; set; }

        [StringLength(200)]
        public string? Subject { get; set; }

        [Required, StringLength(2000)]
        public string? Message { get; set; }

        public DateTime? SentDate { get; set; }
    }
}
