using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ME_API.Models
{
    public class MES_Audit_Rate_D
    {
        [Key]
        [StringLength(15)]
        public string Record_ID { get; set; }
        [Key]
        [StringLength(5)]
        public string Audit_Item_ID { get; set; }
        public int Rating_0 { get; set; }
        public int Rating_1 { get; set; }
        public int Rating_2 { get; set; }
        [Required]
        [StringLength(15)]
        public string Updated_By { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? Updated_Time { get; set; }
        public int? Rate_NA { get; set; }
        [StringLength(500)]
        public string Remark { get; set; }
        [StringLength(200)]
        public string Upload_Picture { get; set; }
    }
}