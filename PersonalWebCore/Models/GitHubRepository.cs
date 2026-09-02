using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PersonalWebCore.Models
{
    public class GitHubRepository
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public int? Stars { get; set; }
        public int? Forks { get; set; }
        public string? Language { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
