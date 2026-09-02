using Microsoft.AspNetCore.Mvc;
using PersonalWebCore.Interfaces;

namespace PersonalWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GitHubController : ControllerBase
    {
        private readonly IGitHubService _gitHubService;
        private readonly ILogger<GitHubController> _logger;

        public GitHubController(IGitHubService gitHubService, ILogger<GitHubController> logger)
        {
            _gitHubService = gitHubService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene los repositorios públicos de GitHub
        /// </summary>
        /// <returns>Lista de repositorios con estadísticas</returns>
        [HttpGet("repos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRepositories()
        {
            try
            {
                var repos = await _gitHubService.GetRepositoriesAsync();
                return Ok(repos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving GitHub repositories");
                return StatusCode(500, new { message = "Error retrieving repositories" });
            }
        }

        /// <summary>
        /// Obtiene la actividad reciente de GitHub
        /// </summary>
        /// <returns>Resumen de actividad reciente</returns>
        [HttpGet("activity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetActivity()
        {
            try
            {
                var activity = await _gitHubService.GetActivityAsync();
                return Ok(new { activity });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving GitHub activity");
                return StatusCode(500, new { message = "Error retrieving activity" });
            }
        }
    }
}