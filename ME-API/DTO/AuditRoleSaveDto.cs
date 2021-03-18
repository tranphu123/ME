using System;

namespace ME_API.DTO
{
    public class AuditRoleSaveDto
    {
         public string user_account { get; set; }

        public string  role_unique { get; set; }

        public string create_by { get; set; }
        public bool status {get;set;}
        public DateTime? create_time { get; set; }
         public AuditRoleSaveDto() {
            this.create_time = DateTime.Now;
        }
    }
}