using Microsoft.AspNetCore.Mvc;
using PersonalWebCore.Interfaces;

namespace PersonalWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        /// <summary>
        /// Obtiene el perfil completo del desarrollador
        /// </summary>
        /// <returns>Perfil con información personal, skills, experiencia y educación</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _profileService.GetProfileAsync();
            return Ok(profile);
        }

        /// <summary>
        /// Obtiene solo las habilidades técnicas
        /// </summary>
        /// <returns>Lista de skills categorizadas</returns>
        [HttpGet("skills")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSkills()
        {
            var skills = await _profileService.GetSkillsAsync();
            return Ok(skills);
        }

        ////// ***** TEST INI *****
        ////// TODO ADRIA: MÉTODO TEMPORAL PARA PROBAR LA LOCALIZACIÓN
        /////// <summary>
        /////// Endpoint de prueba para verificar localización
        /////// </summary>
        ////[HttpGet("test-lang")]
        ////public IActionResult TestLanguage()
        ////{
        ////    var currentCulture = System.Globalization.CultureInfo.CurrentCulture.Name;
        ////    var currentUICulture = System.Globalization.CultureInfo.CurrentUICulture.Name;

        ////    return Ok(new
        ////    {
        ////        culture = currentCulture,
        ////        uiCulture = currentUICulture,
        ////        testText = PersonalWebCore.Helpers.TextHelpers.TextoTraducible("Profile_Title", "Default", "Profile")
        ////    });
        ////}

        /////// <summary>
        /////// Debug: Ver recursos disponibles
        /////// </summary>
        ////[HttpGet("debug-resources")]
        ////public IActionResult DebugResources()
        ////{
        ////    var assembly = typeof(PersonalWebCore.Services.ProfileService).Assembly;
        ////    var resourceNames = assembly.GetManifestResourceNames();

        ////    return Ok(new
        ////    {
        ////        assemblyName = assembly.GetName().Name,
        ////        resourceCount = resourceNames.Length,
        ////        resources = resourceNames
        ////    });
        ////}

        ////// ***** TEST FIN *****
    }
}