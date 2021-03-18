using System;
using System.Collections.Generic;

namespace ME_API.DTO {
    public class ScoreRecordAnsDto {
        public AuditRateMDto auditRateM { get; set; }

        public List<AuditRateDDto> listAuditRateD { get; set; }
    }

}