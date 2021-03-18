using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;

namespace ME_API._Services.Interface
{
    public interface IAuditTypeDService : IMEService<AuditType_D_Dto>
    {
        Task<PagedList<AuditType_D_Dto>> SearchAuditTypeD(PaginationParams param, AuditTypeDParam uditTypeDParam);

        Task<PagedList<AuditType_D_Dto>> SearchByAuditType(PaginationParams param, string audit_Type1, string audit_Type2);
        Task<List<string>> SearchAuditItem(string auditTypeID);
        Task<bool> ChangeVisiable(string ID, string item);
         Task<object> getAllAuditTypeM();
         string GetNameVideoByID(string auditTypeID);
    }
}