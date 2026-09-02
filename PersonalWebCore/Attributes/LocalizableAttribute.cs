using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PersonalWebCore.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
    public class LocalizableAttribute : Attribute
    {
        public string Key { get; set; }
        public string DefaultText { get; set; }
        public string Category { get; set; }

        public LocalizableAttribute(string key, string defaultText, string category = "General")
        {
            Key = key;
            DefaultText = defaultText;
            Category = category;
        }
    }
}
