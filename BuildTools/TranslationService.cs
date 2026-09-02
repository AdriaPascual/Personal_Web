using System.Net.Http;
using Newtonsoft.Json;

namespace PersonalWeb.BuildTools
{
    public class TranslationService
    {
        private readonly HttpClient _httpClient;
        private const string API_URL = "https://translate.googleapis.com/translate_a/single";

        public TranslationService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> TranslateAsync(string text, string fromLang, string toLang)
        {
            if (string.IsNullOrWhiteSpace(text))
                return text;

            try
            {
                var url = $"{API_URL}?client=gtx&sl={fromLang}&tl={toLang}&dt=t&q={Uri.EscapeDataString(text)}";
                var response = await _httpClient.GetStringAsync(url);

                var jsonResponse = JsonConvert.DeserializeObject<dynamic>(response);

                if (jsonResponse?[0]?[0]?[0] != null)
                {
                    string translatedText = jsonResponse[0][0][0].ToString();
                    return translatedText;
                }

                return text;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error traduciendo '{text}': {ex.Message}");
                return text;
            }
        }

        public async Task<Dictionary<string, string>> TranslateDictionaryAsync(
            Dictionary<string, string> texts,
            string fromLang,
            string toLang)
        {
            var translated = new Dictionary<string, string>();

            foreach (var kvp in texts)
            {
                Console.WriteLine($"  Traduciendo: {kvp.Key}...");
                var translatedText = await TranslateAsync(kvp.Value, fromLang, toLang);
                translated[kvp.Key] = translatedText;
                await Task.Delay(200); // Evitar rate limiting
            }

            return translated;
        }
    }
}