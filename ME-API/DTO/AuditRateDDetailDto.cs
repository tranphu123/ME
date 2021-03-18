namespace ME_API.DTO
{
    public class AuditRateDDetailDto
    {
        public string RecordId { get; set; }
        public string AuditItemId { get; set; }
        public string AuditItemLL { get; set; }
        public string AuditItemZW { get; set; }
        public string AuditItemEN { get; set; }
        public int Rating0 { get; set; }
        public int Rating1 { get; set; }
        public int Rating2 { get; set; }
        public int TypeDrating0 { get; set; }
        public int TypeDrating1 { get; set; }
        public int TypeDrating2 { get; set; }
        public int? RatingNA { get; set; }
        public string Remark { get; set; }
        public string UplloadPicture { get; set; }
        public string Rating { get {
            return Rating0 == 1 ? "0" : Rating1 == 1 ? "1" : Rating2 == 1 ? "2" : "NA";
        }}
         public int? oderby { get; set; }
         public string RatingDetail { get; set; }
    }
}