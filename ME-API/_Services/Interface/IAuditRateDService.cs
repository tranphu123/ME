
using System.Threading.Tasks;
using ME_API.DTO;

namespace ME_API._Services.Interface
{
    public interface IAuditRateDService
    {
        Task<bool> Add(AuditRateDDto model);
        Task<bool> UpdateUploadPicture(string recordId, string auditItemId, string uploadPicture);
    }
}