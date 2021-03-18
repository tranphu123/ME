using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class MesOrgRepository :  MERepository<MES_Org>, IMesOrgRepository
    {
        private readonly DataContext _context;
        public MesOrgRepository(DataContext context) : base(context)
        {
            _context = context;
        }
    }
}