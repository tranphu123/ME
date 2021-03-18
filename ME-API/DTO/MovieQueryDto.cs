namespace ME_API.DTO
{
    public class MovieQueryDto
    {
        public string Brand { get; set; }
        public string Version { get; set; }
        public bool Latest { get; set; }
        public string Text { get; set; }
        public string Audit_Type_ID { get; set; }  
        public string Audititem { get; set; }
    }
}