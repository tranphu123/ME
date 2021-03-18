namespace ME_API.DTO
{
    public class ChartByMonthly
    {
        public string Line {get;set;}
        public string Model_No {get;set;}
        public string Line_ModelNo {
            get {
                return Line + "-" + Model_No;
            }
        }
        public int Item_no {get;set;}
        public string Audit_Type1 {get;set;}
        public string Audit_Type2 {get;set;}
        public string Audit_Type {get;set;}
        public int Count {get;set;}
    }
}