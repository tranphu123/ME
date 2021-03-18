using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using ME_API.ViewModel;

namespace ME_API._Services.Interface
{
    public interface IChartByMonthlyService
    {
        
        Task<List<MES_Audit_Type_M>> GetTypes();
        Task<object> GetChart(ChartMonthlyParam param);
        Task<object> GetChartPreviousMonth();
         Task<List<AuditRecDto>> SearchExcel(AuditRecSearch model);
    }
}