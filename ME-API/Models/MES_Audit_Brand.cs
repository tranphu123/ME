using System;
using System.ComponentModel.DataAnnotations;

namespace ME_API.Models
{
    public class MES_Audit_Brand
    {
        [Key]
        public string Brand_ID { get; set; }
        public string Brand_ZW { get; set; }
        public string Brand_EN { get; set; }
        public string Brand_LL { get; set; }
        public string Status { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }
    }
}