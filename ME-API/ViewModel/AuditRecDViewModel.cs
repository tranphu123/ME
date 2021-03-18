using System;

namespace ME_API.ViewModel
{
    public class AuditRecDViewModel
    {
        public string Record_ID {get;set;}
        public int Item_no {get;set;}
        public string ERCS {get;set;}
        public string Audit_Type_ID {get;set;}
        public string Audit_Item {get;set;}
        public string Issue_ZW {get;set;}
        public string Issue_LL {get;set;}
        public string Issue_EN {get;set;}
        public string Before_Picture {get;set;}
        public string After_Picture {get;set;}
        public string PD_PIC {get;set;}
        public string PD_RESP {get;set;}
        public string ME_PIC {get;set;}
        public string Finished_Date {get;set;}
        public string Status {get;set;}
        public string Remark {get;set;}
        public string Updated_By {get;set;}
        public DateTime? Updated_Time {get;set;}
        public string Implement_User {get;set;}
        public DateTime? Implement_Time {get;set;}
        public AuditRecDViewModel() {
            this.Updated_Time = DateTime.Now;
            this.Implement_Time = DateTime.Now;
        }
    }
}