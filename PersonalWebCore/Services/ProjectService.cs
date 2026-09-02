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
                    Name = "Analysis of the Fast Food Dataset from Kaggle",
                    Description = "Comprehensive data analysis and visualization using Python and Jupyter Notebook based on the Fast Food Dataset from Kaggle.",
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
                    Name = "Data Visualization Examples",
                    Description = "Collection of Python notebooks demonstrating various data visualization techniques using libraries such as Matplotlib, Seaborn, and Plotly.",
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
                    Name = "GUI Application for Psychologists",
                    Description = "Desktop application prototype built in Python designed for psychologists (e.g.) to handle adaptable forms and user data.",
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
                    Name = "Walking Game",
                    Description = "A small 2D game made with PyGame that includes sound effects, background music, and keyboard-controlled movements.",
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
                    Name = "Spotify API Integration",
                    Description = "Sample project integrating with the Spotify API via OAuth authentication, retrieving and storing user data in JSON format.",
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
