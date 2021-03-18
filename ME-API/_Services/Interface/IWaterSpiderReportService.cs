using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface
{
    public interface IWaterSpiderReportService
    {
        Task<PagedList<WaterSpiderScoreRecordDto>> GetLisWaterSpiderScoreRecord(PaginationParams paginationParams, ScoreRecordParam scoreRecordParam, bool isPaging = true);
        Task<List<string>> GetAuditType1ByWaterSpider();
    }
}