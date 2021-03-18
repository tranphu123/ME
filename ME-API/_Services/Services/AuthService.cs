using System.Linq;
using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMesUserRepository _repoUsers;
        private readonly IAuditRolesRepository _repoRoles;
        private readonly IAuditRoleUserRepository _repoRoleUser;
        public AuthService(IMesUserRepository repoUsers, IAuditRolesRepository repoRoles, IAuditRoleUserRepository repoRoleUser)
        {
            _repoRoleUser = repoRoleUser;
            _repoRoles = repoRoles;
            _repoUsers = repoUsers;
        }

        public async Task<UserForLogged_Dto> GetUser(string username, string password)
        {
            var user = _repoUsers.FindSingle(x => x.User_ID.Trim() == username.Trim());

            // kiểm tra xem username đó có ko
            if (user == null)
            {
                return null;
            }
            if (user.Password != password)
            {
                return null;
            }
            var roleUser = _repoRoleUser.FindAll(x => x.user_account == user.User_ID);
            var role = _repoRoles.FindAll();
            var roleName = await roleUser.Join(role, x => x.role_unique, y => y.role_unique, (x, y)
            => new Role_Dto { Name = y.role_unique, Position = y.role_sequence }).ToListAsync();

            var result = new UserForLogged_Dto
            {
                Id = user.User_ID,
                Email = user.Email,
                Username = user.User_Name,
                Name = user.User_Name,
                // Nik = user.,
                Role = roleName.OrderBy(x => x.Position).Select(x => x.Name).ToList()
            };

            return result;
        }
    }
}