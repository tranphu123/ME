using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class MesMoRepository : MERepository<MES_MO>, IMesMoRepository
    {
        private readonly DataContext _context;
        public MesMoRepository(DataContext context) : base(context)
        {
            _context = context;
        }
    }
}