using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;
namespace ME_API._Repositories.Repositories
{
    public class AuditRolesRepository: MERepository<MES_Audit_Roles>, IAuditRolesRepository
    {
         private readonly DataContext _context;
        public AuditRolesRepository(DataContext context) : base(context) {
            _context = context;
        }
    }
}