using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class AuditRecDRepository : MERepository<MES_Audit_Rec_D>, IAuditRecDRepository
    {
        private readonly DataContext _context;
        public AuditRecDRepository(DataContext context) : base(context) {
            _context = context;
        }
    }
}