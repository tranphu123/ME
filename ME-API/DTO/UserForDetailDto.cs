using System;

namespace ME_API.DTO
{
    public class UserForDetailDto
    {
        public string User_ID { get; set; }
        public string User_Name { get; set; }
        public string email { get; set; }
        public DateTime Update_Time { get; set; }
        public string Updated_by { get; set; }
    }
}