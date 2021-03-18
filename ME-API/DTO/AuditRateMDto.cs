using System;

namespace ME_API.DTO
{
    public class AuditRateMDto
    {

        public string Record_ID { get; set; }
        public DateTime Record_Date { get; set; }
        public string Audit_Type_ID { get; set; }
        public string PDC { get; set; }
        public string PDC_Name { get; set; }
        public string Building { get; set; }
        public string Line { get; set; }
        public string Audit_Type1 { get; set; }
        public string Audit_Type2 { get; set; }
        public string ME_PIC { get; set; }
        public string PD_RESP { get; set; }
        public string Updated_By { get; set; }
        public DateTime? Updated_Time { get; set; }
        public string Line_ID_2_Name { get; set; }
        public AuditRateMDto()
        {
            this.Updated_Time = DateTime.Now;
        }
        public bool Halting_Production { get; set; }
        public string Model_Name { get; set; }
        public string Model_No { get; set; }
        public string Audit_Kind { get; set; }


    }

}