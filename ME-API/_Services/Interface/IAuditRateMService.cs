
using System.Threading.Tasks;
using ME_API.DTO;

namespace ME_API._Services.Interface
{
    public interface IAuditRateMService
    {
        Task<bool> Add(AuditRateMDto model);
    }
}