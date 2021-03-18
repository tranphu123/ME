
using System;
using System.IO;
using System.Threading.Tasks;
using Aspose.Cells;
using ME_API._Services.Interface;
using ME_API.Helpers;
using ME_API.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WTTrackingReportController : ControllerBase
    {
        private readonly IWTTrackingReportService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public WTTrackingReportController(IWTTrackingReportService service, IWebHostEnvironment webHostEnvironment)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet("status")]
        public async Task<IActionResult> GetAllStatus()
        {
            var data = await _service.GetAllStatus();
            return Ok(data);
        }
        [HttpPost("searchModel")]
        public async Task<IActionResult> SearchByModel([FromQuery] PaginationParams param, [FromBody] AuditRecSearch model)
        {
            var auditRecs = await _service.SearchByModel(param, model);
            Response.AddPagination(auditRecs.CurrentPage, auditRecs.PageSize, auditRecs.TotalCount, auditRecs.TotalPages);
            return Ok(auditRecs);
        }

        [HttpPost("searchExcel")]
        public async Task<IActionResult> SearchExcel([FromBody] AuditRecSearch model)
        {
            var data = await _service.SearchExcel(model,"2");
         
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\WT_Summary_Report.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);
            //lưu data với ASPO vào excel
            designer.SetDataSource("result", data);
            designer.Process();  
             Worksheet ws = designer.Workbook.Worksheets[0];
             for (var i =1; i <= data.Count ; i++)
            {
                var filePathB4 = "wwwroot\\uploaded\\images\\" + data[i-1].Before_Picture;
                var filePathAfter = "wwwroot\\uploaded\\images\\" + data[i-1].After_Picture;

                if (System.IO.File.Exists(filePathB4))
                {
                    var pictureIndex = ws.Pictures.Add(i, 17, filePathB4);
                    Aspose.Cells.Drawing.Picture picture = ws.Pictures[pictureIndex];
                    picture.Width = 100;
                    picture.Height = 100;
                    //margin 
                    picture.Top =3;
                    picture.Left =3;
                    //set lại Height cho dòng có image
                    ws.Cells.Rows[i].Height = 80;
                }
                if (System.IO.File.Exists(filePathAfter))
                {
                    //Add picture và set Size cho image 
                    var pictureIndex = ws.Pictures.Add(i, 18, filePathAfter);
                    Aspose.Cells.Drawing.Picture picture = ws.Pictures[pictureIndex];
                    picture.Width = 100;
                    picture.Height = 100;
                    //margin 
                    picture.Top =3;
                    picture.Left =3;
                    //set lại Height cho dòng có image
                    ws.Cells.Rows[i].Height = 80;
                }
            }           
            MemoryStream stream = new MemoryStream();
            if(data.Count !=0)
            {
             designer.Workbook.Save(stream, SaveFormat.Xlsx); 
            }
            // designer.Workbook.Save (path + "Test.xlsx", SaveFormat.Xlsx);

            byte[] result = stream.ToArray();

            return File(result, "application/xlsx", "WT_Summary_Report" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");
        }
        
        
        [HttpPost("ExportExcelWTTrackingList")]
        public async Task<IActionResult> ExportExcelWTTrackingList([FromBody] AuditRecSearch model)
        {
            var data = await _service.SearchExcel(model,"2");
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\WT_Tracking_List.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();

            designer.Workbook = new Workbook(path);
            //gán giá trị tĩnh
            Worksheet ws = designer.Workbook.Worksheets[0];
            if (data.Count != 0)
            {
                ws.Cells["B2"].PutValue(data[0].Record_Time);
                ws.Cells["B3"].PutValue(data[0].PDC);
                ws.Cells["B4"].PutValue(data[0].Attendees);
                ws.Cells["D2"].PutValue(data[0].Building);
                ws.Cells["D3"].PutValue(data[0].Line);
                ws.Cells["F2"].PutValue(data[0].Model_Name);
                ws.Cells["F3"].PutValue(data[0].Model_No);
                ws.Cells["I2"].PutValue(data[0].Chief);
                ws.Cells["I3"].PutValue(data[0].Recorder);
            }
            //lưu data với ASPO vào excel
            designer.SetDataSource("result", data);
            designer.Process();
                //Chèn image vào excel và set lại rows
              for (var i = 6; i <= data.Count + 5; i++)
            {
                var filePathB4 = "wwwroot\\uploaded\\images\\" + data[i - 6].Before_Picture;
                var filePathAfter = "wwwroot\\uploaded\\images\\" + data[i - 6].After_Picture;

                if (System.IO.File.Exists(filePathB4))
                {
                    var pictureIndex = ws.Pictures.Add(i, 7, filePathB4);
                    Aspose.Cells.Drawing.Picture picture = ws.Pictures[pictureIndex];
                    picture.Width = 100;
                    picture.Height = 100;
                    //margin 
                    picture.Top =3;
                    picture.Left =3;
                    //set lại Height cho dòng có image
                    ws.Cells.Rows[i].Height = 80;
                }
                if (System.IO.File.Exists(filePathAfter))
                {
                    //Add picture và set Size cho image 
                    var pictureIndex = ws.Pictures.Add(i, 8, filePathAfter);
                    Aspose.Cells.Drawing.Picture picture = ws.Pictures[pictureIndex];
                    picture.Width = 100;
                    picture.Height = 100;
                    //margin 
                    picture.Top =3;
                    picture.Left =3;
                    //set lại Height cho dòng có image
                    ws.Cells.Rows[i].Height = 80;
                }
            }

            MemoryStream stream = new MemoryStream();
            designer.Workbook.Save(stream, SaveFormat.Xlsx);
            // designer.Workbook.Save (path + "Test.xlsx", SaveFormat.Xlsx);

            byte[] result = stream.ToArray();

            return File(result, "application/xlsx", "WT_Tracking_List" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");

        }
      
    }
}