using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.ViewModel;

namespace ME_API._Services.Interface
{
    public interface  IWTTrackingReportService
    {
          Task<List<string>> GetAllStatus();
        Task<PagedList<AuditRecDto>> SearchByModel(PaginationParams param, AuditRecSearch model);
        Task<List<AuditRecDto>> SearchExcel(AuditRecSearch model,string WT="1");
        
    }
}