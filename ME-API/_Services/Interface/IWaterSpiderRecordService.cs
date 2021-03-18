using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface
{
    public interface IWaterSpiderRecordService
    {
        Task<PagedList<WaterSpiderScoreRecordDto>> GetLisWaterSpiderScoreRecord (PaginationParams paginationParams, ScoreRecordParam scoreRecordParam, bool isPaging = true);
        int SumEachRating1InAuditTypeDAndAuditRateD(string recordId);
        Task<List<string>> GetBrandByWaterSpider();
        Task<object> GetAuditTypeByBrandByWaterSpider(string brand);
        Task<List<string>> GetAuditType1ByWaterSpider();
    }
}