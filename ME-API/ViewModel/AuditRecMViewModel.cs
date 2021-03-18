using System;

namespace ME_API.ViewModel
{
    public class AuditRecMViewModel
    {
        public string Record_ID {get;set;}
        public string Record_Time {get;set;}
        public string PDC {get;set;}
        public string Building {get;set;}
        public string Line {get;set;}
        public string Model_Name {get;set;}
        public string Model_No {get;set;}
        public string Chief {get;set;}
        public string Recorder {get;set;}
        public string Attendees {get;set;}
        public string Updated_By {get;set;}
        public DateTime? Updated_Time {get;set;}
        public AuditRecMViewModel() {
            this.Updated_Time = DateTime.Now;
        }
    }
}