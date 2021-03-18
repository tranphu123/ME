using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface
{
    public interface IMesAuditOrgService
    {
        Task<object> GetAllPDC();
        Task<object> GetAllBuilding(string pdc);
        Task<object> GetAllLineID(string pdc,string building);
        Task<object> GetLineIDIsLine(string pdc,string building, string isLine);
        Task<bool> Changeline(MesAuditOrgDto auditOrgDto);
        Task<PagedList<MesAuditOrgDto>> GetAllLinePaginations(PaginationParams param, ShowLineParam showlineParam);

    }
}