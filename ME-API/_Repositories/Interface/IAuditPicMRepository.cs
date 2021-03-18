using System.Threading.Tasks;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Interface
{
    public interface IAuditPicMRepository : IMERepository<MES_Audit_PIC_M>
    {
        Task<bool> CheckAuditPicMExists(string picTypeID);
    }
}