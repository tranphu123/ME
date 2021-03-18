using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Aspose.Cells;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuditRecDController : ControllerBase
    {
        private readonly IAuditRecDService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IAuditRecMService _auditRecMService;

        public AuditRecDController(IAuditRecDService service, IWebHostEnvironment webHostEnvironment,
                                    IAuditRecMService auditRecMService)
        {
            _webHostEnvironment = webHostEnvironment;
            _auditRecMService = auditRecMService;
            _service = service;
        }

        [HttpGet("all", Name = "GetAllRecDs")]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams param)
        {
            var auditRecs = await _service.GetAllAuditRecViewModel(param);
            Response.AddPagination(auditRecs.CurrentPage, auditRecs.PageSize, auditRecs.TotalCount, auditRecs.TotalPages);
            return Ok(auditRecs);
        }

        [HttpGet("recDs", Name = "RecDs")]
        public async Task<IActionResult> GetRecDs([FromQuery] PaginationParams param)
        {
            var recDs = await _service.GetWithPaginations(param);
            Response.AddPagination(recDs.CurrentPage, recDs.PageSize, recDs.TotalCount, recDs.TotalPages);
            return Ok(recDs);
        }
        [HttpGet("allExcel", Name = "getallExcel")]
        public async Task<IActionResult> GetAllExcel()
        {
            var auditRecs = await _service.GetAllExcel();
            return Ok(auditRecs);
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
         
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\WT_Summary.xlsx");
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

            return File(result, "application/xlsx", "WT_Summary" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");

        }

        [HttpGet("getbyid/{recordID}/{item_no}")]
        public async Task<IActionResult> GetbyId(string recordID, int item_no)
        {
            var data = await _service.GetRecDById(recordID, item_no);
            return Ok(data);
        }


        [HttpPost("addnew")]
        public async Task<IActionResult> CreateAuditRecD([FromBody] AuditRecDDto auditRecDDto)
        {
            var auditRecM = await _auditRecMService.GetRecMById(auditRecDDto.Record_ID);
            var auditRecD = await _service.GetById(auditRecDDto.Record_ID);
            if (auditRecD != null)
            {
                auditRecDDto.Item_no = auditRecD.Item_no + 1;
            }
            else
            {
                auditRecDDto.Item_no = 1;
            }
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            auditRecDDto.Updated_By = username;
            auditRecDDto.Implement_User = username;
            string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
            //byte[] file = Convert.FromBase64String(auditRecDDto.Before_Picture);
          if(auditRecDDto.Before_Picture !="")
          {
              var source = auditRecDDto.Before_Picture;
            string base64 = source.Substring(source.IndexOf(',') + 1);
            base64 = base64.Trim('\0');
            byte[] chartData = Convert.FromBase64String(base64);
             if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
        var fileName =auditRecM.Record_ID + "_" + auditRecM.Line + "_" + auditRecM.Model_No +
             "_B4_" + auditRecDDto.Item_no +".jpg";
            string filePathB4 = Path.Combine(folder, fileName);
            System.IO.File.WriteAllBytes(filePathB4, chartData);
             auditRecDDto.Before_Picture = fileName;
          }
           if(auditRecDDto.After_Picture !="")
          {
              var source = auditRecDDto.After_Picture;
            string base64 = source.Substring(source.IndexOf(',') + 1);
            base64 = base64.Trim('\0');
            byte[] chartData = Convert.FromBase64String(base64);
             if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
        var fileName =auditRecM.Record_ID + "_" + auditRecM.Line + "_" + auditRecM.Model_No +
             "_After_" + auditRecDDto.Item_no +".jpg";
            string filePathAfter = Path.Combine(folder, fileName);
            System.IO.File.WriteAllBytes(filePathAfter, chartData);
             auditRecDDto.After_Picture = fileName;
          }
            
            if (await _service.AddRecD(auditRecDDto))
            {
                return NoContent();
            }

            throw new Exception("Creating the Audit Rec D failed on save");
        }
        
         [HttpPost("edit/{before}/{after}")]
        public async Task<IActionResult> EditAuditRecD([FromBody] AuditRecDDto auditRecDDto,Boolean before,Boolean after)
        {
            var auditRecM = await _auditRecMService.GetRecMById(auditRecDDto.Record_ID);
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            auditRecDDto.Updated_By = username;
            auditRecDDto.Implement_User = username;
            string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
            //byte[] file = Convert.FromBase64String(auditRecDDto.Before_Picture);
          if(before ==true)
          {
              var source = auditRecDDto.Before_Picture;
            string base64 = source.Substring(source.IndexOf(',') + 1);
            base64 = base64.Trim('\0');
            byte[] chartData = Convert.FromBase64String(base64);
             if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
        var fileName =auditRecM.Record_ID + "_" + auditRecM.Line + "_" + auditRecM.Model_No +
             "_B4_" + auditRecDDto.Item_no +".jpg";
            string filePathB4 = Path.Combine(folder, fileName);
            System.IO.File.WriteAllBytes(filePathB4, chartData);
             auditRecDDto.Before_Picture = fileName;
          }
           if(after == true)
          {
              var source = auditRecDDto.After_Picture;
            string base64 = source.Substring(source.IndexOf(',') + 1);
            base64 = base64.Trim('\0');
            byte[] chartData = Convert.FromBase64String(base64);
             if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
        var fileName =auditRecM.Record_ID + "_" + auditRecM.Line + "_" + auditRecM.Model_No +
             "_After_" + auditRecDDto.Item_no +".jpg";
            string filePathAfter = Path.Combine(folder, fileName);
            System.IO.File.WriteAllBytes(filePathAfter, chartData);
             auditRecDDto.After_Picture = fileName;
          }
             if (await _service.UpdateRecD(auditRecDDto))
            {
                return NoContent();
            }

            throw new Exception("Edit the Audit Rec D failed on save");
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


        [HttpGet("getListMail")]
        public async Task<IActionResult> GetListMail(string line) {
            var data = await _service.GetListMail(line);
            return Ok(data);
        }

    }
}