using PersonalWebCore.Interfaces;
using PersonalWebCore.Models;
using PersonalWebCore.Helpers;

namespace PersonalWebCore.Services
{
    public class ProjectService : IProjectService
    {
        public async Task<List<Project>> GetAllProjectsAsync()
        {
            return await Task.FromResult(new List<Project>
            {
                new Project
                {
                    Id = 1,
                    Name = TextHelpers.TextoTraducible("Proj1_Name", "Fast Food Dataset Analysis", "Projects"),
                    Description = TextHelpers.TextoTraducible("Proj1_Desc",
                        "Análisis exhaustivo de datos y visualización con Python y Jupyter Notebook sobre el dataset de Fast Food de Kaggle.",
                        "Projects"),
                    ThumbnailUrl = "/assets/projects/fastfood-analysis.jpg",
                    Technologies = new List<string> { "Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter Notebook" },
                    GithubUrl = "https://github.com/AdriaPascual/Analysis-of-the-Fast-Food-Dataset-from-Kaggle",
                    LiveUrl = "",
                    CreatedDate = new DateTime(2023, 4, 11),
                    IsFeatured = true
                },
                new Project
                {
                    Id = 2,
                    Name = TextHelpers.TextoTraducible("Proj2_Name", "Data Visualization Examples", "Projects"),
                    Description = TextHelpers.TextoTraducible("Proj2_Desc",
                        "Colección de notebooks Python con diversas técnicas de visualización de datos usando Matplotlib, Seaborn y Plotly.",
                        "Projects"),
                    ThumbnailUrl = "/assets/projects/data-visualization-examples.jpg",
                    Technologies = new List<string> { "Python", "Matplotlib", "Seaborn", "Plotly", "Jupyter Notebook" },
                    GithubUrl = "https://github.com/AdriaPascual/data-visualization-examples",
                    LiveUrl = "",
                    CreatedDate = new DateTime(2023, 3, 20),
                    IsFeatured = false
                },
                new Project
                {
                    Id = 3,
                    Name = TextHelpers.TextoTraducible("Proj3_Name", "GUI App for Psychologists", "Projects"),
                    Description = TextHelpers.TextoTraducible("Proj3_Desc",
                        "Prototipo de aplicación de escritorio en Python con formularios adaptables para gestión de datos de usuarios.",
                        "Projects"),
                    ThumbnailUrl = "/assets/projects/gui-app.jpg",
                    Technologies = new List<string> { "Python", "Tkinter", "OOP", "Desktop" },
                    GithubUrl = "https://github.com/AdriaPascual/GUI",
                    LiveUrl = "",
                    CreatedDate = new DateTime(2023, 2, 9),
                    IsFeatured = false
                },
                new Project
                {
                    Id = 4,
                    Name = TextHelpers.TextoTraducible("Proj4_Name", "Walking Game", "Projects"),
                    Description = TextHelpers.TextoTraducible("Proj4_Desc",
                        "Juego 2D en PyGame con efectos de sonido, música de fondo y movimiento por teclado.",
                        "Projects"),
                    ThumbnailUrl = "/assets/projects/walking-game.jpg",
                    Technologies = new List<string> { "Python", "PyGame", "OOP" },
                    GithubUrl = "https://github.com/AdriaPascual/Walking_game",
                    LiveUrl = "",
                    CreatedDate = new DateTime(2023, 2, 9),
                    IsFeatured = true
                },
                new Project
                {
                    Id = 5,
                    Name = TextHelpers.TextoTraducible("Proj5_Name", "Spotify API Integration", "Projects"),
                    Description = TextHelpers.TextoTraducible("Proj5_Desc",
                        "Integración con la API de Spotify via OAuth, recuperando y almacenando datos de usuario en formato JSON.",
                        "Projects"),
                    ThumbnailUrl = "/assets/projects/api-spotify.jpg",
                    Technologies = new List<string> { "Python", "Spotify API", "OAuth", "JSON", "Requests" },
                    GithubUrl = "https://github.com/AdriaPascual/API_Spotify",
                    LiveUrl = "",
                    CreatedDate = new DateTime(2023, 2, 9),
                    IsFeatured = true
                }
            });
        }

        public async Task<Project> GetProjectByIdAsync(int id)
        {
            var projects = await GetAllProjectsAsync();
            return projects.FirstOrDefault(p => p.Id == id);
        }

        public async Task<List<Project>> GetFeaturedProjectsAsync()
        {
            var projects = await GetAllProjectsAsync();
            return projects.Where(p => (bool)p.IsFeatured).ToList();
        }
    }
}
