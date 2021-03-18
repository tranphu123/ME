using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;

namespace ME_API._Services.Interface
{
    public interface IAuditPicDService : IMEService<AuditPicDDto>
    {
        Task<object> GetAllPdPic();
        Task<object> GetAllMePic();
        Task<string> GetPdDepartment(string pdc);
        Task<string> GetPdBuilding(string pdc);
        Task<bool> Delete(AuditPicDDto model);
         Task<string> GetPdPicByID(string Resp_id);
        Task<string> GetMePicByID(string Resp_id);
         Task<string> GetBuidingByID(string buiding);
    }
}