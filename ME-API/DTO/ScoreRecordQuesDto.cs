namespace ME_API.DTO {
    public class ScoreRecordQuesDto {
        public string Audit_Type_ID { get; set; }
        public string Audit_Item_ID { get; set; }
        public string Quesion { get; set; }
        public string QuesionLL { get; set; }
        public string QuesionEN { get; set; }
        public string QuesionZW { get; set; }
        public int TypeDrating0 { get; set; }
        public int TypeDrating1 { get; set; }
        public int TypeDrating2 { get; set; }
         public int? orderby { get; set; }
    }
}