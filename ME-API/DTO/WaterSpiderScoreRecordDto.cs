using System;

namespace ME_API.DTO
{
    public class WaterSpiderScoreRecordDto
    {
        public string RecordId { get; set; }
        public DateTime AuditDate { get; set; }
        public string AuditType { get; set; }
        public string LineId { get; set; }
        public string Line_Name { get; set; }
        // dfgdfgd
        public int Loss { get; set; }
        public int? NA { get; set; }
        public int Score { get; set; }
        public int Total {  get
            {
                return Score +Loss;
            } }
        public decimal Achieving
        {
 
            get
            {
                 if(Total ==0){
                return 0;
            }
                return (decimal)((decimal)Score / (decimal)Total);
            }
        }

        public bool CheckAnswerAllYet { get; set; }
    }
}