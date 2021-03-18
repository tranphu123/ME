using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ME_API.Models
{
    public partial class VW_MES_Audit_EOLR_PPH
    {
        [Column(TypeName = "date")]
        public DateTime Yield_Date { get; set; }
        [Required]
        [StringLength(4)]
        public string Dept_ID { get; set; }
        [StringLength(15)]
        public string Dept_Name { get; set; }
        [StringLength(100)]
        public string Style_No { get; set; }
        [StringLength(40)]
        public string Style_Name { get; set; }
        [Column(TypeName = "numeric(10, 1)")]
        public decimal? Real_Hour { get; set; }
        public int? WT_Head_Cnt { get; set; }
        public int? Output { get; set; }
        public double? EOLR { get; set; }
        public double? PPH { get; set; }
        public double? EOLR_Target { get; set; }
        public double? PPH_Target { get; set; }
    }
}