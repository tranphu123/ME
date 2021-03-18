using System.Collections.Generic;

namespace ME_API.DTO
{
    public class SMEStaticChartDto
    {
        public string Factory { get; set; }
        public List<PDC> ListDept { get; set; } = new List<PDC>();
    }

    public class PDC
    {
        public string PDCName { get; set; }
        public string PDC_ID { get; set; }
        public List<Builing> ListBuilding { get; set; } = new List<Builing>();

    }

    public class Builing
    {
         public string Building { get; set; }
        public string BuildingName { get; set; }
        public List<Line> ListLine { get; set; } = new List<Line>();

    }

    public class Line
    {
        public string Line_ID { get; set; }
        public string Line_Name { get; set; }
        public string Icon_Path { get; set;}

    }
}