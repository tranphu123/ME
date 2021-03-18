using System.Threading.Tasks;
using ME_API.DTO;

namespace ME_API._Services.Interface
{
    public interface IAuditPicMService : IMEService<AuditPicMDto>
    {
        Task<bool> CheckAuditPicMExists(string picTypeID);
    }
}