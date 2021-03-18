using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.ViewModel;

namespace ME_API._Services.Interface
{
    public interface IAuditTypeService : IMEService<AuditTypeDto>
    {
        Task<object> GetAuditsByAuditType(AuditType1FormDto formdata);
        Task<List<string>> GetAllAuditType1();
        Task<List<string>> GetAllAuditType2();
        Task<bool> CheckAuditTypeExists(string brand, string auditType1, string auditType2, int version);
        Task<List<AuditTypeViewModel>> GetAuditType_1_2_Vesion();
        Task<List<string>> GetAllAuditType2By6s();
        Task<List<string>> GetAllAuditType2BySME();
        Task<bool> Upgrade(string auditTypeId);
        Task<string> GetAuditTypeID();
    }
}