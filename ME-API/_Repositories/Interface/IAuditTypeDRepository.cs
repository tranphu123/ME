using System.Threading.Tasks;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Interface
{
    public interface IAuditTypeDRepository : IMERepository<MES_Audit_Type_D>
    {
        
        string GetAuditItemLL(string auditTypeId, string auditItemId);
        string GetAuditItemEN(string auditTypeId, string auditItemId);
        string GetAuditItemZW(string auditTypeId, string auditItemId);
        int GetTypeDrating0(string auditTypeId, string auditItemId);
        int GetTypeDrating1(string auditTypeId, string auditItemId);
        int GetTypeDrating2(string auditTypeId, string auditItemId);
        MES_Audit_Type_D Get_Audit_Type_D(string ID, string item);
    }
}