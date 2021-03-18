using System;

namespace ME_API.DTO
{
    public class AuditRoleUserDto
    {
        public string user_account { get; set; }

        public string  role_unique { get; set; }

        public string create_by { get; set; }

        public DateTime? create_time { get; set; }
         public AuditRoleUserDto() {
            this.create_time = DateTime.Now;
        }
    }
}