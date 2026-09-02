using System.Net.Http.Headers;
using System.Text.Json;
using PersonalWebCore.Models;
using PersonalWebCore.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace PersonalWebInfrastructure.ExternalServices
{
    public class GitHubApiClient : IGitHubService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly ILogger<GitHubApiClient> _logger;
        private const string GITHUB_API_URL = "https://api.github.com";
        private const string CACHE_KEY_REPOS = "github_repos";
        private const int CACHE_HOURS = 1;

        public GitHubApiClient(HttpClient httpClient, IMemoryCache cache, ILogger<GitHubApiClient> logger)
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;

            // Configurar HttpClient para GitHub API
            _httpClient.BaseAddress = new Uri(GITHUB_API_URL);
            _httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("PersonalWebAPI", "1.0"));
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
        }

        public async Task<List<GitHubRepository>> GetRepositoriesAsync()
        {
            // Intentar obtener del caché
            if (_cache.TryGetValue(CACHE_KEY_REPOS, out List<GitHubRepository>? cachedRepos) && cachedRepos != null)
            {
                _logger.LogInformation("Returning GitHub repositories from cache");
                return cachedRepos;
            }

            try
            {
                // TODO: Cambiar "AdriaPascual" por tu usuario de GitHub
                var response = await _httpClient.GetAsync("/users/AdriaPascual/repos?sort=updated&per_page=100");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("GitHub API returned status code: {StatusCode}", response.StatusCode);
                    return new List<GitHubRepository>();
                }

                var content = await response.Content.ReadAsStringAsync();
                var githubRepos = JsonSerializer.Deserialize<List<GitHubRepoResponse>>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (githubRepos == null)
                {
                    return new List<GitHubRepository>();
                }

                // Mapear a nuestro modelo
                var repositories = githubRepos.Select(r => new GitHubRepository
                {
                    Name = r.Name ?? "",
                    Description = r.Description ?? "",
                    Url = r.HtmlUrl ?? "",
                    Stars = r.StargazersCount,
                    Forks = r.ForksCount,
                    Language = r.Language ?? "Unknown",
                    UpdatedAt = r.UpdatedAt
                }).ToList();

                // Guardar en caché por 1 hora
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(CACHE_HOURS));

                _cache.Set(CACHE_KEY_REPOS, repositories, cacheOptions);
                _logger.LogInformation("Fetched {Count} repositories from GitHub API", repositories.Count);

                return repositories;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching repositories from GitHub");
                return new List<GitHubRepository>();
            }
        }

        public async Task<string> GetActivityAsync()
        {
            // Implementación simplificada - retorna un resumen
            var repos = await GetRepositoriesAsync();
            var recentRepos = repos.OrderByDescending(r => r.UpdatedAt).Take(5);

            return $"Recent activity: {recentRepos.Count()} repositories updated recently";
        }
    }

    // Clase interna para deserializar la respuesta de GitHub API
    internal class GitHubRepoResponse
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? HtmlUrl { get; set; }
        public int StargazersCount { get; set; }
        public int ForksCount { get; set; }
        public string? Language { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}