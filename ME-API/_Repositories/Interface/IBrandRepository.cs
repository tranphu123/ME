using System.Threading.Tasks;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Interface
{
    public interface IBrandRepository : IMERepository<MES_Audit_Brand>
    {
        Task<bool> CheckBrandExists(string brandId);
    }
}