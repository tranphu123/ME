using System;
using System.ComponentModel.DataAnnotations;

namespace ME_API.Models
{
    public class MES_Audit_PIC_M
    {
        [Key]
        public string PIC_Type_ID { get; set; }
        public string PIC_Type_ZW { get; set; }
        public string PIC_Type_EN { get; set; }
        public string PIC_Type_LL { get; set; }
        public string Status { get; set; }
        public string Updated_By { get; set; }
        public DateTime Updated_Time { get; set; }
    }
}