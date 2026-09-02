using Microsoft.AspNetCore.Mvc;
using PersonalWebCore.Interfaces;

namespace PersonalWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// Obtiene todos los proyectos
        /// </summary>
        /// <returns>Lista completa de proyectos</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        /// <summary>
        /// Obtiene un proyecto específico por ID
        /// </summary>
        /// <param name="id">ID del proyecto</param>
        /// <returns>Detalles del proyecto</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            return Ok(project);
        }

        /// <summary>
        /// Obtiene solo los proyectos destacados
        /// </summary>
        /// <returns>Lista de proyectos destacados</returns>
        [HttpGet("featured")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFeaturedProjects()
        {
            var projects = await _projectService.GetFeaturedProjectsAsync();
            return Ok(projects);
        }
    }
}