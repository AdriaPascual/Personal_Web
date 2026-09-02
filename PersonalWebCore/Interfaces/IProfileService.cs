using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PersonalWebCore.Models;

namespace PersonalWebCore.Interfaces
{
    public interface IProfileService
    {
        Task<Profile> GetProfileAsync();
        Task<List<Skill>> GetSkillsAsync();
    }
}