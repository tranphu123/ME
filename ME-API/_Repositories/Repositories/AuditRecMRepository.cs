using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class AuditRecMRepository : MERepository<MES_Audit_Rec_M>, IAuditRecMRepository
    {
        private readonly DataContext _context;
        public AuditRecMRepository(DataContext context) : base(context) {
            _context = context;
        }
    }
}