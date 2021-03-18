using System.Collections.Generic;

namespace ME_API.DTO
{
    public class ScoreRecordDetailDto
    {
        public AuditRateMDto auditRateM { get; set; }
        public List<AuditRateDDetailDto> listAuditRateD { get; set; }
    }
}