using System.Reflection;
using System.Text.RegularExpressions;

namespace PersonalWeb.BuildTools
{
    public class LocalizationBuilder
    {
        private readonly TranslationService _translationService;
        private readonly ResxManager _resxManager;
        private readonly Dictionary<string, Dictionary<string, string>> _extractedTexts;

        public LocalizationBuilder()
        {
            _translationService = new TranslationService();
            _resxManager = new ResxManager();
            _extractedTexts = new Dictionary<string, Dictionary<string, string>>();
        }

        public async Task BuildLocalizationAsync(string coreProjectPath)
        {
            Console.WriteLine("=== Iniciando extracción y traducción automática ===\n");

            // 1. Extraer todos los textos marcados con [Localizable]
            Console.WriteLine("Paso 1: Extrayendo textos marcados con [Localizable]...");
            ExtractLocalizableAttributes(coreProjectPath);

            // 2. Buscar patrones TextoTraducible("texto") en el código
            Console.WriteLine("\nPaso 2: Buscando patrones TextoTraducible() en el código...");
            ExtractTextFromCodePatterns(coreProjectPath);

            // 3. Generar archivos .resx por categoría
            Console.WriteLine("\nPaso 3: Generando archivos .resx...");
            await GenerateResxFilesAsync(coreProjectPath);

            Console.WriteLine("\n=== Traducción completada ===");
        }

        private void ExtractLocalizableAttributes(string projectPath)
        {
            // Buscar archivos .cs y extraer los atributos directamente del código fuente
            var csFiles = Directory.GetFiles(projectPath, "*.cs", SearchOption.AllDirectories);
            var pattern = @"\[Localizable\s*\(\s*""([^""]+)""\s*,\s*""([^""]*)""\s*(?:,\s*""([^""]+)"")?\s*\)\]";

            foreach (var file in csFiles)
            {
                var content = File.ReadAllText(file);
                var matches = Regex.Matches(content, pattern);

                foreach (Match match in matches)
                {
                    string key = match.Groups[1].Value;
                    string defaultText = match.Groups[2].Value;
                    string category = match.Groups.Count > 3 && !string.IsNullOrEmpty(match.Groups[3].Value)
                        ? match.Groups[3].Value
                        : "General";

                    if (string.IsNullOrEmpty(defaultText))
                        continue;

                    if (!_extractedTexts.ContainsKey(category))
                    {
                        _extractedTexts[category] = new Dictionary<string, string>();
                    }

                    _extractedTexts[category][key] = defaultText;
                    Console.WriteLine($"  Encontrado: [{category}] {key} = {defaultText.Substring(0, Math.Min(50, defaultText.Length))}...");
                }
            }
        }

        private void ExtractTextFromCodePatterns(string projectPath)
        {
            // Buscar patrones como: TextoTraducible("clave", "texto", "categoria")
            var csFiles = Directory.GetFiles(projectPath, "*.cs", SearchOption.AllDirectories);
            var pattern = @"TextoTraducible\s*\(\s*""([^""]+)""\s*,\s*""([^""]+)""\s*(?:,\s*""([^""]+)"")?\s*\)";

            foreach (var file in csFiles)
            {
                var content = File.ReadAllText(file);
                var matches = Regex.Matches(content, pattern);

                foreach (Match match in matches)
                {
                    string key = match.Groups[1].Value;
                    string text = match.Groups[2].Value;
                    string category = match.Groups.Count > 3 && !string.IsNullOrEmpty(match.Groups[3].Value)
                        ? match.Groups[3].Value
                        : "General";

                    if (!_extractedTexts.ContainsKey(category))
                    {
                        _extractedTexts[category] = new Dictionary<string, string>();
                    }

                    _extractedTexts[category][key] = text;
                    Console.WriteLine($"  Encontrado en código: [{category}] {key} = {text.Substring(0, Math.Min(50, text.Length))}...");
                }
            }
        }

        private async Task GenerateResxFilesAsync(string projectPath)
        {
            var resourcesPath = Path.Combine(projectPath, "Resources");

            if (!Directory.Exists(resourcesPath))
            {
                Directory.CreateDirectory(resourcesPath);
            }

            foreach (var category in _extractedTexts)
            {
                Console.WriteLine($"\n  Procesando categoría: {category.Key}");

                // Crear carpeta para la categoría si no existe
                var categoryPath = Path.Combine(resourcesPath, category.Key);
                if (!Directory.Exists(categoryPath))
                {
                    Directory.CreateDirectory(categoryPath);
                }

                var baseFileName = $"{category.Key}Resources";

                // Archivo español (original)
                var esFilePath = Path.Combine(categoryPath, $"{baseFileName}.es.resx");
                Console.WriteLine($"    Generando {baseFileName}.es.resx...");
                _resxManager.WriteResx(esFilePath, category.Value);

                // Archivo inglés (traducido)
                var enFilePath = Path.Combine(categoryPath, $"{baseFileName}.en.resx");
                Console.WriteLine($"    Generando {baseFileName}.en.resx...");
                var translatedTextsEN = await _translationService.TranslateDictionaryAsync(category.Value, "es", "en");
                _resxManager.WriteResx(enFilePath, translatedTextsEN);

                // Archivo catalán (traducido)
                var caFilePath = Path.Combine(categoryPath, $"{baseFileName}.ca.resx");
                Console.WriteLine($"    Generando {baseFileName}.ca.resx...");
                var translatedTextsCA = await _translationService.TranslateDictionaryAsync(category.Value, "es", "ca");
                _resxManager.WriteResx(caFilePath, translatedTextsCA);

                Console.WriteLine($"    ✓ {category.Key} completado ({category.Value.Count} textos)");
            }
        }
    }
}