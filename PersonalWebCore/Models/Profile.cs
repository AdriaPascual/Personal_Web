using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PersonalWebCore.Attributes;

namespace PersonalWebCore.Models
{
    public class Profile
    {
        [Localizable("Profile_FullName", "Nombre Completo", "Profile")]
        public string FullName { get; set; }
        [Localizable("Profile_Title", "Desarrollador .NET Core", "Profile")]
        public string Title { get; set; }
        [Localizable("Profile_Email", "tu@email.com", "Profile")]
        public string Email { get; set; }
        [Localizable("Profile_Phone", "+34 600 000 000", "Profile")]
        public string Phone { get; set; }
        [Localizable("Profile_Location", "Madrid, España", "Profile")]
        public string Location { get; set; }
        [Localizable("Profile_Summary", "Desarrollador especializado en C# y .NET Core con experiencia en aplicaciones web modernas y APIs REST.", "Profile")]
        public string Summary { get; set; }
        public string ProfileImageUrl { get; set; }
        public List<string> SocialLinks { get; set; }
        public List<Skill> Skills { get; set; }
        public List<Experience> Experience { get; set; }
        public List<Education> Education { get; set; }
    }

    public class Skill
    {
        [Localizable("Skill_Name", "", "Skills")]
        public string Name { get; set; }
        [Localizable("Skill_Category", "", "Skills")]
        public string Category { get; set; }
        public int Level { get; set; }
    }

    public class Experience
    {
        [Localizable("Experience_Company", "", "Experience")]
        public string? Company { get; set; }
        [Localizable("Experience_Position", "", "Experience")]
        public string? Position { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        [Localizable("Experience_Description", "", "Experience")]
        public string? Description { get; set; }
        public List<string>? Technologies { get; set; }
    }

    public class Education
    {
        [Localizable("Education_Institution", "", "Education")]
        public string? Institution { get; set; }
        [Localizable("Education_Degree", "", "Education")]
        public string? Degree { get; set; }
        [Localizable("Education_Field", "", "Education")]
        public string? Field { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        [Localizable("Education_Field", "", "Education")]
        public string? Description {get; set;} 
    }
}