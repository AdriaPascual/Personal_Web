using Microsoft.Extensions.Localization;

namespace PersonalWebCore.Helpers
{
    public static class TextHelpers
    {
        private static IStringLocalizerFactory? _localizerFactory;

        public static void Initialize(IStringLocalizerFactory localizerFactory)
        {
            _localizerFactory = localizerFactory;
        }

        public static string TextoTraducible(string key, string defaultText, string category = "General")
        {
            if (_localizerFactory == null)
            {
                return defaultText;
            }

            try
            {
                // Incluir la estructura de carpetas: Resources.{Category}.{Category}Resources
                var resourceName = $"Resources.{category}.{category}Resources";
                var localizer = _localizerFactory.Create(resourceName, "PersonalWebCore");
                var localizedString = localizer[key];

                return localizedString.ResourceNotFound ? defaultText : localizedString.Value;
            }
            catch
            {
                return defaultText;
            }
        }
    }
}