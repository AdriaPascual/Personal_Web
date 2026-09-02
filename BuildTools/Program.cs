namespace PersonalWeb.BuildTools
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Personal Web - Build Tools");
            Console.WriteLine("==========================\n");

            if (args.Length == 0)
            {
                Console.WriteLine("Uso: PersonalWeb.BuildTools <ruta-al-proyecto-Core>");
                return;
            }

            var coreProjectPath = args[0];

            if (!Directory.Exists(coreProjectPath))
            {
                Console.WriteLine($"Error: No se encuentra el directorio {coreProjectPath}");
                return;
            }

            var builder = new LocalizationBuilder();
            await builder.BuildLocalizationAsync(coreProjectPath);
        }
    }
}