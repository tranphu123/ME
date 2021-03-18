using ME_API.Data;
using ME_API.Models;

namespace ME_API._Repositories.Interface
{
    public interface IAuditRateDRepository : IMERepository<MES_Audit_Rate_D>
    {
        int SumRating0(string recordId);
        int SumRating1(string recordId);
        int? SumRatingNa(string recordId);
        int SumEachRating1InAuditTypeDAndAuditRateD(string recordId);
        int SumEachRating0InAuditTypeDAndAuditRateD(string recordId);
        int? SumEachRatingNAInAuditTypeDAndAuditRateD(string recordId);
    }
}