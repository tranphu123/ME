using System.Threading.Tasks;
using ME_API.Models;

namespace ME_API.Data
{
    public interface IAuthRepository
    {
        Task<MES_User> Login(string username, string password);
    }
}