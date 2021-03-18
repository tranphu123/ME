using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class MesAuditOrgRepository : MERepository<MES_Audit_Org>, IMesAuditOrgRepository
    {
        public MesAuditOrgRepository(DataContext context) : base(context)
        {
        }
    }
}