using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;
namespace ME_API._Repositories.Repositories
{
    public class AuditRoleUserRepository: MERepository<MES_Audit_RoleUser>, IAuditRoleUserRepository
    {
         private readonly DataContext _context;
        public AuditRoleUserRepository(DataContext context) : base(context) {
            _context = context;
        }
    }
}