using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;
using PersonalWebCore.Helpers;
using Microsoft.Extensions.Localization;

namespace PersonalWebCore.Services
{
    public class ProfileService : IProfileService
    {
        public ProfileService()
        {
        }

        public async Task<Profile> GetProfileAsync()
        {
            return await Task.FromResult(new Profile
            {
                FullName = TextHelpers.TextoTraducible("Profile_FullName", "Adrià Pascual Cuesta", "Profile"),
                Title = TextHelpers.TextoTraducible("Profile_Title", "Desarrollador .NET Core y Python", "Profile"),
                Email = TextHelpers.TextoTraducible("Profile_Email", "adripascual108@gmail.com", "Profile"),
                Phone = TextHelpers.TextoTraducible("Profile_Phone", "+34 627 901 548", "Profile"),
                Location = TextHelpers.TextoTraducible("Profile_Location", "Barcelona, España", "Profile"),
                Summary = TextHelpers.TextoTraducible("Profile_Summary",
                    "Desarrollador de software especializado en .NET Core, C#, Python y tecnologías web. " +
                    "Experiencia en arquitectura de software, APIs REST, procesamiento de datos y despliegue en contenedores.",
                    "Profile"),
                ProfileImageUrl = "/assets/profile.jpg",

                SocialLinks = new List<string>
                {
                    "https://github.com/AdriaPascual",
                    "https://linkedin.com/in/adria-pascual-cuesta/"
                },

                Skills = new List<Skill>
                {
                    // Backend
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_CSharp", "C#", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 90 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_DotNet", ".NET 6/7/8", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 85 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_ASPNETCore", "ASP.NET Core", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 85 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_EFCore", "Entity Framework Core", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Python", "Python", "Skills"), Category = TextHelpers.TextoTraducible("Category_Data", "Backend / Data", "Skills"), Level = 85 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_VBNet", "Vb.Net", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 70 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_REST", "REST API (JWT, OAuth)", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_BackgroundServices", "Background Services", "Skills"), Category = TextHelpers.TextoTraducible("Category_Backend", "Backend", "Skills"), Level = 75 },

                    // Frontend
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_JavaScript", "JavaScript (ES6+)", "Skills"), Category = TextHelpers.TextoTraducible("Category_Frontend", "Frontend", "Skills"), Level = 75 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Bootstrap", "Bootstrap 5", "Skills"), Category = TextHelpers.TextoTraducible("Category_Frontend", "Frontend", "Skills"), Level = 70 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_jQuery", "jQuery", "Skills"), Category = TextHelpers.TextoTraducible("Category_Frontend", "Frontend", "Skills"), Level = 70 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_SignalR", "SignalR", "Skills"), Category = TextHelpers.TextoTraducible("Category_FrontendRealtime", "Frontend / Realtime", "Skills"), Level = 65 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_WPF", "WPF", "Skills"), Category = TextHelpers.TextoTraducible("Category_Desktop", "Frontend (Desktop)", "Skills"), Level = 70 },

                    // Data & ML
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_SQLServer", "SQL Server", "Skills"), Category = TextHelpers.TextoTraducible("Category_Database", "Database", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Pandas", "Pandas / NumPy", "Skills"), Category = TextHelpers.TextoTraducible("Category_DataScience", "Data Science", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Scikit", "Scikit-learn / KNIME", "Skills"), Category = TextHelpers.TextoTraducible("Category_ML", "Machine Learning", "Skills"), Level = 75 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_ETL", "ETL con Python", "Skills"), Category = TextHelpers.TextoTraducible("Category_DataEngineering", "Data Engineering", "Skills"), Level = 75 },

                    // DevOps y Seguridad
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Docker", "Docker", "Skills"), Category = TextHelpers.TextoTraducible("Category_DevOps", "DevOps", "Skills"), Level = 70 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Identity", "ASP.NET Identity", "Skills"), Category = TextHelpers.TextoTraducible("Category_Security", "Security", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Serilog", "Serilog / Logging estructurado", "Skills"), Category = TextHelpers.TextoTraducible("Category_Monitoring", "Security / Monitoring", "Skills"), Level = 75 },

                    // Tools & Methodologies
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Git", "Git / GitHub", "Skills"), Category = TextHelpers.TextoTraducible("Category_Tools", "Tools", "Skills"), Level = 80 },
                    new Skill { Name = TextHelpers.TextoTraducible("Skill_Agile", "Agile / Scrum / XP", "Skills"), Category = TextHelpers.TextoTraducible("Category_Methodologies", "Methodologies", "Skills"), Level = 75 }
                },

                Experience = new List<Experience>
                {
                    new Experience
                    {
                        Company = TextHelpers.TextoTraducible("Company_Unlimioo", "Unlimioo", "Experience"),
                        Position = TextHelpers.TextoTraducible("Position_DevSoftware", "Desarrollador de Software y Aplicaciones Web", "Experience"),
                        StartDate = "2022",
                        EndDate = TextHelpers.TextoTraducible("EndDate_Present", "Actualidad", "Experience"),
                        Description = TextHelpers.TextoTraducible("Experience_UnlimiooDesc",
                            "Desarrollo y mantenimiento de aplicaciones web y de escritorio basadas en .NET Core y Python. " +
                            "Implementación de APIs REST, optimización de consultas SQL, gestión de caché y desarrollo de servicios en segundo plano. " +
                            "Integración de APIs externas, despliegue con Docker y diseño de interfaces modernas con Bootstrap y jQuery.",
                            "Experience"),
                        Technologies = new List<string> { "C#", ".NET Core", "Python", "Entity Framework", "SQL Server", "JavaScript", "Bootstrap", "Docker", "Serilog", "ASP.NET Identity" }
                    },
                    new Experience
                    {
                        Company = TextHelpers.TextoTraducible("Company_ADDA", "ADDA SL", "Experience"),
                        Position = TextHelpers.TextoTraducible("Position_TechSecurity", "Técnico en Seguridad Privada", "Experience"),
                        StartDate = "2018",
                        EndDate = "2021",
                        Description = TextHelpers.TextoTraducible("Experience_ADDADesc",
                            "Diseño, instalación y mantenimiento de sistemas electrónicos aplicados a la seguridad, incluyendo CCTV, control de accesos y redes locales. " +
                            "Gestión de proyectos técnicos y configuración de routers, switches y almacenamiento en la nube.",
                            "Experience"),
                        Technologies = new List<string> { "CCTV", "Control de Acceso", "LAN", "Routers", "Switches" }
                    }
                },

                Education = new List<Education>
                {
                    new Education
                    {
                        Institution = TextHelpers.TextoTraducible("Edu_VIU", "Universidad Internacional de Valencia (VIU)", "Education"),
                        Degree = TextHelpers.TextoTraducible("Edu_Grado", "Grado en Ingeniería Informática", "Education"),
                        Field = TextHelpers.TextoTraducible("Edu_Field_CS", "Ingeniería de Software y Sistemas", "Education"),
                        StartDate = "2025",
                        EndDate = TextHelpers.TextoTraducible("Edu_EndDate", "Actualidad", "Education")
                    },
                    new Education
                    {
                        Institution = TextHelpers.TextoTraducible("Edu_VIUPosgrado", "Universidad Internacional de Valencia (VIU)", "Education"),
                        Degree = TextHelpers.TextoTraducible("Edu_Posgrado", "Experto Universitario en Programación en Python para Ciencia de Datos y Web", "Education"),
                        Field = TextHelpers.TextoTraducible("Edu_Field_Data", "Desarrollo Web y Ciencia de Datos", "Education"),
                        StartDate = "2022",
                        EndDate = "2022",
                        Description = TextHelpers.TextoTraducible("Edu_VIUDesc",
                            "Formación en desarrollo web y científico con Python: PyQt, Django, REST APIs, Selenium, SQL/NoSQL, PyGame y metodologías ágiles.",
                            "Education")
                    },
                    new Education
                    {
                        Institution = TextHelpers.TextoTraducible("Edu_UB", "Universitat de Barcelona", "Education"),
                        Degree = TextHelpers.TextoTraducible("Edu_Criminology", "Grado en Criminología", "Education"),
                        Field = TextHelpers.TextoTraducible("Edu_Field_Security", "Seguridad y Prevención", "Education"),
                        StartDate = "2018",
                        EndDate = "2022"
                    },
                    new Education
                    {
                        Institution = TextHelpers.TextoTraducible("Edu_PixelPro", "PixelPro", "Education"),
                        Degree = TextHelpers.TextoTraducible("Edu_Bootcamp", "Bootcamp Fullstack Developer", "Education"),
                        Field = TextHelpers.TextoTraducible("Edu_Field_Web", "Desarrollo Web", "Education"),
                        StartDate = "2022",
                        EndDate = "2022"
                    },
                    new Education
                    {
                        Institution = TextHelpers.TextoTraducible("Edu_Femxa", "Femxa", "Education"),
                        Degree = TextHelpers.TextoTraducible("Edu_SecurityIT", "Curso de Seguridad Informática en la Empresa", "Education"),
                        Field = TextHelpers.TextoTraducible("Edu_Field_Cyber", "Seguridad Informática", "Education"),
                        StartDate = "2021",
                        EndDate = "2021"
                    }
                }
            });
        }

        public async Task<List<Skill>> GetSkillsAsync()
        {
            var profile = await GetProfileAsync();
            return profile.Skills;
        }
    }
}
