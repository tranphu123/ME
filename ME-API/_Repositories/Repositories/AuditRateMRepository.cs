using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class AuditRateMRepository : MERepository<MES_Audit_Rate_M>, IAuditRateMRepository
    {
        public AuditRateMRepository(DataContext context) : base(context)
        {
        }
    }
}