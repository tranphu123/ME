using System;

namespace ME_API.DTO
{
    public class AuditRateDDto
    {
        public string Record_ID { get; set; }
        public string Audit_Item_ID { get; set; }
        public int Rating_0 { get; set; }
        public int Rating_1 { get; set; }
        public int Rating_2 { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }
        public int Rate_NA { get; set; }
        public string Remark { get; set; }
        public string Upload_Picture { get; set; }
    }
}