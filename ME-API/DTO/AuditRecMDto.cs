using System;

namespace ME_API.DTO
{
    public class AuditRecMDto
    {
        public string Record_ID {get;set;}
        public DateTime? Record_Time {get;set;}
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
        public AuditRecMDto() {
            this.Updated_Time = DateTime.Now;
        }
    }
}