using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.ViewModel;

namespace ME_API._Services.Interface
{
    public interface IAuditRecMService : IMEService<AuditRecMDto>
    {
        Task<List<string>> GetAllBuilding();
        Task<object> GetAllLine();
        Task<List<string>> GetAllModelName();
        Task<List<string>> GetAllModelNo();
        Task<List<string>> GetAllPDC();
        Task<bool> AddAuditRecM(AuditRecMViewModel model);
        Task<bool> ImportExcel(string filePath,string userName);
        Task<string> GetRecordIdRate();
        Task<object> GetAllRecordID();
         Task<AuditRecMDto> GetRecMById(string record_ID);
    }
}