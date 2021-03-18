using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class AuditPicDRepository : MERepository<MES_Audit_PIC_D>, IAuditPicDRepository
    {
        private readonly DataContext _context;
        public AuditPicDRepository(DataContext context) : base(context) {
            _context = context;
        }
    }
}