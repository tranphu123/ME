using System;

namespace ME_API.Models
{
    public class MES_Audit_RoleUser
    {
        public string user_account { get; set; }

        public string  role_unique { get; set; }

        public string create_by { get; set; }

        public DateTime? create_time { get; set; }
    }
}