using System;

namespace ME_API.DTO
{
    public class MesAuditOrgDto
    {
        public string Factory_ID { get; set; }
        public string PDC_ID { get; set; }
        public string PDC_Name { get; set; }
        public string Line_ID { get; set; }
        public string Line_Name { get; set; }
        public string Dept_ID { get; set; }
        public string Dept_Name { get; set; }
        public string Building { get; set; }
        public string Building_Name { get; set; }
        public int Line_Seq { get; set; }
        public int? Status { get; set; }
        public DateTime? Update_Time { get; set; }
        public string Updated_By { get; set; }
        public string HP_Dept_ID { get; set; }
        public int? IsAGV { get; set; }
        public string Block { get; set; }
        public string Line_ID_2 { get; set; }
        public string Line_ID_2_Name { get; set; }
        public string Icon_Path { get; set;}
        public bool? IsWT {get;set;}
        public bool? IsSME {get;set;}
        public bool? Is6S {get;set;}
        public bool? IsWS {get;set;}
         public MesAuditOrgDto() {
            this.Update_Time = DateTime.Now;
        }
    }
}