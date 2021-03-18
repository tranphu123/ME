using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.Models;

namespace ME_API._Services.Interface
{
    public interface IVWMESAuditEOLRPPHService
    {
        Task<List<VW_MES_Audit_EOLR_PPH>> GetDataKpiTrackingChart(string timeFrom, string timeEnd, string line, string styleNo);
        Task<object> GetListLine();
        Task<List<string>> GetListStyleNo();
    }
}