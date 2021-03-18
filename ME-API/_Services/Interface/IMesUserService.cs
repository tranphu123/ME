using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface
{
    public interface IMesUserService : IMEService<UserForDetailDto>
    {
         Task<object> GetRoleByUser(string user);
         Task<bool> saveRole(List<AuditRoleSaveDto> auditRoleUser,string userName);
    }
}