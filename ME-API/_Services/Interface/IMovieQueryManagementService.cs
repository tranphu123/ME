using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface
{
    public interface IMovieQueryManagementService
    {
        Task<List<int>> GetVersion(string brand);
        Task<object> GetAuditItem(string audittypeID);
         Task<object> GetAllAudittype(string audittypeID);
          Task<PagedList<AuditType_D_Dto>> SeachMoviequerylist(PaginationParams param, MovieQueryDto movieQueryDto);
    }
}