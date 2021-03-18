using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;

namespace ME_API._Services.Interface
{
    public interface IMesOrgService
    {
        Task<List<string>> GetAllPDC();
        Task<List<string>> GetAllBuilding(string pdc);
        Task<List<string>> GetAllLineID(string pdc,string building);
    }
}