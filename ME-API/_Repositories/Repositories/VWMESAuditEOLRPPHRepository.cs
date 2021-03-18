using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class VWMESAuditEOLRPPHRepository : MERepository<VW_MES_Audit_EOLR_PPH>, IVWMESAuditEOLRPPHRepository
    {
        public VWMESAuditEOLRPPHRepository(DataContext context) : base(context)
        {
        }
    }
}