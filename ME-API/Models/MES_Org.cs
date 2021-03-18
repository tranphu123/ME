using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ME_API.Models
{
    public class MES_Org
    {
        [Key][Column(Order = 0)]
        public string Factory_ID {get;set;}
        [Key][Column(Order = 1)]
        public string PDC_ID {get;set;}
        [Key][Column(Order = 2)]
        public string Line_ID {get;set;}
        [Key][Column(Order = 3)]
        public string Dept_ID {get;set;}
        public string Building {get;set;}
        public int Line_Seq {get;set;}
        public int Status {get;set;}
        public string HP_Dept_ID {get;set;}
        public DateTime? Update_Time {get;set;}
        public string Updated_By {get;set;}
        public int IsAGV {get;set;}
        public string Line_ID_2 {get;set;}

    }
}