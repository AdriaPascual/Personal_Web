using System.Xml.Linq;

namespace PersonalWeb.BuildTools
{
    public class ResxManager
    {
        public Dictionary<string, string> ReadResx(string filePath)
        {
            var resources = new Dictionary<string, string>();

            if (!File.Exists(filePath))
            {
                return resources;
            }

            try
            {
                var doc = XDocument.Load(filePath);
                var dataElements = doc.Root?.Elements("data");

                if (dataElements != null)
                {
                    foreach (var data in dataElements)
                    {
                        var name = data.Attribute("name")?.Value;
                        var value = data.Element("value")?.Value;

                        if (!string.IsNullOrEmpty(name) && value != null)
                        {
                            resources[name] = value;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error leyendo {filePath}: {ex.Message}");
            }

            return resources;
        }

        public void WriteResx(string filePath, Dictionary<string, string> resources)
        {
            var directory = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var doc = new XDocument(
                new XDeclaration("1.0", "utf-8", null),
                new XElement("root",
                    new XElement("resheader",
                        new XAttribute("name", "resmimetype"),
                        new XElement("value", "text/microsoft-resx")),
                    new XElement("resheader",
                        new XAttribute("name", "version"),
                        new XElement("value", "2.0")),
                    new XElement("resheader",
                        new XAttribute("name", "reader"),
                        new XElement("value", "System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089")),
                    new XElement("resheader",
                        new XAttribute("name", "writer"),
                        new XElement("value", "System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"))
                )
            );

            foreach (var kvp in resources)
            {
                if (!string.IsNullOrEmpty(kvp.Key))
                {
                    doc.Root?.Add(
                        new XElement("data",
                            new XAttribute("name", kvp.Key),
                            new XAttribute(XNamespace.Xml + "space", "preserve"),
                            new XElement("value", kvp.Value ?? string.Empty)
                        )
                    );
                }
            }

            doc.Save(filePath);
        }

        public List<string> FindAllResxFiles(string projectPath, string baseFileName)
        {
            var files = new List<string>();
            var resourcesPath = Path.Combine(projectPath, "Resources");

            if (Directory.Exists(resourcesPath))
            {
                files.AddRange(Directory.GetFiles(resourcesPath, $"{baseFileName}.*.resx", SearchOption.AllDirectories));
            }

            return files;
        }
    }
}