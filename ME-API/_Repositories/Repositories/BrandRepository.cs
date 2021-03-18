using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Repositories.Repositories
{
    public class BrandRepository : MERepository<MES_Audit_Brand>, IBrandRepository
    {
        private readonly DataContext _context;
        public BrandRepository(DataContext context) : base(context)
        {
            _context = context;
        }
        public async Task<bool> CheckBrandExists(string brandId)
        {
            if (await _context.MES_Audit_Brand.AnyAsync(x => x.Brand_ID == brandId))
                return true;
            return false;
        }
    }
}