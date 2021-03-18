using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Repositories.Repositories
{
    public class AuditPicMRepository : MERepository<MES_Audit_PIC_M>, IAuditPicMRepository
    {
        private readonly DataContext _context;
        public AuditPicMRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> CheckAuditPicMExists(string picTypeID)
        {
            var model = await _context.MES_Audit_PIC_M.AnyAsync(x => x.PIC_Type_ID == picTypeID);
            if (model) {
                return true;
            } else{
                return false;
            }
        }
    }
}