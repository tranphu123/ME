using System;
using System.IO;
using System.Threading.Tasks;
using Aspose.Cells;
using ME_API._Services.Interface;
using ME_API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SixsRecordController : ControllerBase
    {
        private readonly ISixsRecordService _iSixsRecordService;
        private readonly IAuditPicDService _auditPicDService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IAuditRateService _auditRateService;

        public SixsRecordController(ISixsRecordService iSixsRecordService,IAuditPicDService auditPicDService,
                                     IWebHostEnvironment webHostEnvironment, IAuditRateService auditRateService)
        {
            _auditRateService = auditRateService;
            _iSixsRecordService = iSixsRecordService;
           _auditPicDService = auditPicDService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("sixs-list")]
        public async Task<IActionResult> GetListSixsScoreRecord([FromQuery] PaginationParams paginationParams, ScoreRecordParam scoreRecordParam)
        {
            var data = await _iSixsRecordService.GetListSixsScoreRecord(paginationParams, scoreRecordParam);
            Response.AddPagination(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);
            return Ok(data);
        }


        [HttpPost("ExportExcelSixs")]
        public async Task<ActionResult> ExportExcelSixsRecord([FromQuery] PaginationParams paginationParams, ScoreRecordParam sixsScoreRecordParam)
        {
            var data = await _iSixsRecordService.GetListSixsScoreRecord(paginationParams, sixsScoreRecordParam, false);

            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\Sixs_Score_Record_Template.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);

            Worksheet ws = designer.Workbook.Worksheets[0];

            designer.SetDataSource("result", data);
            designer.Process();

            MemoryStream stream = new MemoryStream();
            designer.Workbook.Save(stream, SaveFormat.Xlsx);

            // designer.Workbook.Save (path + "Test.xlsx", SaveFormat.Xlsx);

            byte[] result = stream.ToArray();

            return File(result, "application/xlsx", "Sixs_Score_Record" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");
        }


        [HttpGet("ExportExcelScoreRecordDetail")]
        public async Task<ActionResult> ExportExcelScoreRecordDetail(string recordId)
        {
            var data = await _auditRateService.GetScoreRecordDetail(recordId);
            var Building = await _auditPicDService.GetBuidingByID(data.auditRateM.Building);
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\Sixs_Score_Record_Detail_Template.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);

            Worksheet ws = designer.Workbook.Worksheets[0];
            // Gán giá trị tĩnh
            ws.Cells["B2"].PutValue(data.auditRateM.Record_Date);
            ws.Cells["D2"].PutValue(data.auditRateM.PDC_Name);
            ws.Cells["F2"].PutValue(Building);
            ws.Cells["B3"].PutValue(data.auditRateM.Updated_By);
            ws.Cells["D3"].PutValue(data.auditRateM.Updated_Time);
            ws.Cells["F3"].PutValue(data.auditRateM.Line_ID_2_Name);
            ws.Cells["F4"].PutValue(data.auditRateM.Audit_Type2);

            designer.SetDataSource("result", data.listAuditRateD);
            designer.Process();
             for (var i =6; i <= data.listAuditRateD.Count+5 ; i++)
            {
                var filePathB4 = "wwwroot\\uploaded\\images\\" + data.listAuditRateD[i-6].UplloadPicture;

                if (System.IO.File.Exists(filePathB4))
                {
                    var pictureIndex = ws.Pictures.Add(i, 6, filePathB4);
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

            byte[] result = stream.ToArray();

            return File(result, "application/xlsx", "Sixs_Score_Record_Detail" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");
        }

        [HttpGet("getbrandbysixs")]
        public async Task<IActionResult> GetListBrandBySixs()
        {
            var data = await _iSixsRecordService.GetBrandBySixs();
            return Ok(data);
        }

        [HttpGet("getaudittypebybrandbysixs")]
        public async Task<IActionResult> GetListAuditTypeByBrandBySixs(string brand)
        {
            var data = await _iSixsRecordService.GetAuditTypeByBranBySixs(brand);
            return Ok(data);
        }

        [HttpGet("getaudittype1bysixs")]
        public async Task<IActionResult> GetListAuditType1BySixs()
        {
            var data = await _iSixsRecordService.GetAuditType1BySixs();
            return Ok(data);
        }

    }
}