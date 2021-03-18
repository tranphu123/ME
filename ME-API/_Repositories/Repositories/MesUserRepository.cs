using ME_API._Repositories.Interface;
using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Repositories
{
    public class MesUserRepository :  MERepository<MES_User>, IMesUserRepository
    {
        private readonly DataContext _context;

        public MesUserRepository(DataContext context) : base(context)
        {
            _context = context;
        }
    }
}