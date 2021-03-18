using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ME_API.Models
{
    public class MES_Audit_Type_D
    {
        [Key][Column(Order = 0)]
        public string Audit_Type_ID { get; set; }
        [Key][Column(Order = 1)]
        public string Audit_Item_ID { get; set; }
        public string Audit_Type3_ZW { get; set; }
        public string Audit_Type3_EN { get; set; }
        public string Audit_Type3_LL { get; set; }
        public string Audit_Item_EN {get;set;}
        public string Audit_Item_LL {get;set;}
        public string Audit_Item_ZW { get; set; }
        public int Rating_0 { get; set; }
        public int Rating_1 { get; set; }
        public int Rating_2 { get; set; }
        public int Version {get;set;}
        public string Updated_By {get;set;}
        public DateTime? Updated_Time { get; set; }
        public string Movie_Name { get; set; } 
        public bool Visible { get; set;} 
    }
}