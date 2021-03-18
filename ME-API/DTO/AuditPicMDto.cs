using System;

namespace ME_API.DTO
{
    public class AuditPicMDto
    {
        public string PIC_Type_ID { get; set; }
        public string PIC_Type_ZW { get; set; }
        public string PIC_Type_EN { get; set; }
        public string PIC_Type_LL { get; set; }
        public string Status { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }      
        public AuditPicMDto() {
            this.Updated_Time = DateTime.Now;
        }
    }
}