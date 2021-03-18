using System;
using System.ComponentModel.DataAnnotations;

namespace ME_API.Models
{
    public class MES_Audit_Type_M
    {
        [Key]
        public string Audit_Type_ID { get; set; }
        public string Brand { get; set; }
        public string Audit_Type1 { get; set; }
        public string Audit_Type2 { get; set; }
        public string Audit_Type2_Name { get; set; }
        public int Audit_Num { get; set; }
        public int Version { get; set; }
        public string Status { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }
        public string Audit_Kind { get; set; }
    }
}