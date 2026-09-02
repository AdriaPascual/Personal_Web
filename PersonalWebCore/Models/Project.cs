using PersonalWebCore.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PersonalWebCore.Models
{
    public class Project
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public List<string>? Technologies { get; set; }
        public string? GithubUrl { get; set; }
        public string? LiveUrl { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? IsFeatured { get; set; }
    }
}
