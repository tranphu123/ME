using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ME_API.Models
{
    public class MES_Audit_Rate_M
    {
        [Key]
        [StringLength(15)]
        public string Record_ID { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime Record_Date { get; set; }
        [Required]
        [StringLength(10)]
        public string Audit_Type_ID { get; set; }
        [Required]
        [StringLength(1)]
        public string PDC { get; set; }
        [Required]
        [StringLength(3)]
        public string Building { get; set; }
        [Required]
        [StringLength(3)]
        public string Line { get; set; }
        [StringLength(10)]
        public string Audit_Type1 { get; set; }
        [StringLength(100)]
        public string Audit_Type2 { get; set; }
        [Required]
        [StringLength(50)]
        public string ME_PIC { get; set; }
        [StringLength(50)]
        public string PD_RESP { get; set; }
        [Required]
        [StringLength(15)]
        public string Updated_By { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? Updated_Time { get; set; }
        public bool Halting_Production { get; set; }
        public string Model_Name { get; set; }
        public string Model_No { get; set; }
        public string Audit_Kind { get; set; }
    }
}