using System;

namespace ME_API.DTO
{
    public class SMEScoreRecordDto
    {
        public string RecordId { get; set; }
        public DateTime AuditDate { get; set; }
        public string AuditType { get; set; }
        public string AuditType2 { get; set; }

        public string LineId { get; set; }
         public string Line_Name { get; set; }
        public int? RatingNa { get; set; }
        public int Rating0 { get; set; }
        public int Rating1 { get; set; }
        public int Rating2 { get; set; }
        public int Total
        {
            get
            {
                return Rating1 + Rating0 + (int)RatingNa + Rating2;
            }
        }

        public int NeedToDoQty
        {
            get
            {
                return Rating0 + Rating1 + Rating2;
            }
        }

        public decimal Achieving
        {
            get
            {
                if (NeedToDoQty == 0)
                {
                    return 0;
                }
                else
                {
                    return ((decimal)Rating1 / (decimal)NeedToDoQty / 2 * 100) + ((decimal)Rating2 / (decimal)NeedToDoQty * 100);
                    // return ((decimal)Rating1 + 4 * (decimal)Rating2) / (decimal)NeedToDoQty;
                }
            }
        }
        public string UpdateBy { get; set; }

        public DateTime? UpdateTime { get; set; }
        public string AchievingPercent
        {
            get
            {
                return Math.Round(Achieving, 2) + " %";
            }
        }

        public bool CheckAnswerAllYet { get; set; }

        //Get Static data chart
        public string  PDC { get; set; }

        public string  Building { get; set; }
    }
}