
using System;
using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;
using Aspose.Cells;
using ME_API._Services.Interface;
using ME_API.Helpers;
using ME_API.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChartMonthlyController : ControllerBase
    {
        private readonly IChartByMonthlyService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ChartMonthlyController(IChartByMonthlyService service,
                                     IWebHostEnvironment webHostEnvironment)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("types")]
        public async Task<IActionResult> Types() {
            var data = await _service.GetTypes();
            return Ok(data);
        }
        [HttpPost("chartMonthly")]
        public async Task<IActionResult> GetChart([FromBody]ChartMonthlyParam param) {
            var data = await _service.GetChart(param);
            return Ok(data);
        }

        [HttpGet("sendMail")]
        public IActionResult SendMail() {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("mail.shc.ssbshoes.com");
            mail.From = new MailAddress("noreply@shc.ssbshoes.com");
            // mail.To.Add("philong.nguyen@shc.ssbshoes.com");
            mail.To.Add("nam.nguyen@shc.ssbshoes.com");
            mail.Subject = "System Bottom";
            mail.Body = "- Check xem thử file đính kèm mail " + " \n\n " + "- Check xem thử file đính kèm mail ";

            System.Net.Mail.Attachment attachment;
            attachment = new System.Net.Mail.Attachment("D:\\file.txt");
            mail.Attachments.Add(attachment);

            SmtpServer.Port = 25;
            SmtpServer.Credentials = new System.Net.NetworkCredential("noreply@shc.ssbshoes.com", "p@ssw0rd");
            SmtpServer.EnableSsl = true;

            try
            {
                SmtpServer.Send(mail);
                return Ok(true);
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        // [HttpGet("getDay")]
        // public IActionResult GetDay() {
        //     // DateTime timeNow = DateTime.Now;

        //     // // Ngày cuối cùng của tháng hiện tại
        //     // DateTime m = timeNow.AddMonths(1);
        //     // m = m.AddDays(-(m.Day));

        //     // // Ngày cuối cùng của tháng trước
        //     // DateTime d = timeNow.AddDays((-timeNow.Day));
        //     // return Ok(d.Day);

        //     DateTime now = DateTime.Now;
        //     var startDate = new DateTime(now.Year, now.Month-1, 1);
        //     var endDate = startDate.AddMonths(1).AddDays(-1);
        //     return Ok(true);
        // }
        
        [HttpGet("getChartPreviousMonth")]
        public async Task<IActionResult> GetChartPreviousMonth() {
            var result = await _service.GetChartPreviousMonth();
            return Ok(result);
        }
   
    [HttpPost("ExportExcel")]
        public async Task<IActionResult> ExportExcel([FromBody] AuditRecSearch model)
        {
            var data = await _service.SearchExcel(model);
         
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\ImproveProjectRecords_ChartByMonthly_Template.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);
            //lưu data với ASPO vào excel
            designer.SetDataSource("result", data);
            designer.Process();  
             Worksheet ws = designer.Workbook.Worksheets[0];
             for (var i =2; i <= data.Count+1 ; i++)
            {
                var filePathB4 = "wwwroot\\uploaded\\images\\" + data[i-2].Before_Picture;
                var filePathAfter = "wwwroot\\uploaded\\images\\" + data[i-2].After_Picture;

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

            return File(result, "application/xlsx", "ImproveProjectRecords_ChartByMonthly" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xlsx");

        }


   }
}