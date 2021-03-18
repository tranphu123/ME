using System;

namespace ME_API.DTO
{
    public class BrandDto
    {
        public string Brand_ID { get; set; }
        public string Brand_ZW { get; set; }
        public string Brand_EN { get; set; }
        public string Brand_LL { get; set; }
        public string Status { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }

        public BrandDto()
        {
            this.Updated_Time = DateTime.Now;
        }
    }
}