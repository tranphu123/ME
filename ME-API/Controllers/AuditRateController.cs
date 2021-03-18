using System.Security.Claims;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ME_API._Services.Interface;
using ME_API.DTO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuditRateController : ControllerBase
    {
        private readonly IAuditRateMService _auditRateMService;
        private readonly IAuditRateDService _auditRateDService;
        private readonly IAuditRateService _auditRateService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AuditRateController(IAuditRateDService auditRateDService, IAuditRateMService auditRateMService, IAuditRateService auditRateService, IWebHostEnvironment webHostEnvironment)
        {
            _auditRateService = auditRateService;
            _auditRateDService = auditRateDService;
            _auditRateMService = auditRateMService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("getlistquesrecord")]
        public async Task<ActionResult> GetListQuesRecord(string auditTypeId)
        {
            var data = await _auditRateService.GetListQuesScoreRecord(auditTypeId);
            return Ok(data);

        }

        [HttpPost("save")]
        public async Task<ActionResult> SaveScopeRecordRate(ScoreRecordAnsDto param)
        {
            if (await _auditRateService.SaveScopeRecord(param))
            {
                return NoContent();
            };
            throw new Exception("Error ");
        }

        [HttpGet("detail/{recordId}")]
        public async Task<ActionResult> GetScoreRecordDetail(string recordId)
        {
            var data = await _auditRateService.GetScoreRecordDetail(recordId);
            if (data != null)
            {
                return Ok(data);
            }
            return NoContent();
        }

        [HttpPost("upload")]
        public async Task<ActionResult> UploadPicture(IFormFile file, string recordId, string auditItemId)
        {
            recordId = Request.Form["recordId"];
            auditItemId = Request.Form["auditItemId"];
            if (file != null)
            {
                var filename = ContentDispositionHeaderValue
                                   .Parse(file.ContentDisposition)
                                   .FileName
                                   .Trim('"');
                var uploadPicture = "AuditRateDRemark_" + recordId + "_" + auditItemId + Path.GetExtension(filename);

                string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, uploadPicture);

                // kiểm tra file cũ có chưa xóa đi
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                if (await _auditRateDService.UpdateUploadPicture(recordId, auditItemId, uploadPicture))
                {
                    return NoContent();
                }
                throw new Exception("Error ");
            }
            return NoContent();
        }
        [HttpGet("getlanguage/{user}")]
        public async Task<ActionResult> GetLanguage(string user)
        {
            var data = await _auditRateService.GetLanguage(user);
            if (data != null)
            {
                return Ok(data);
            }
            return NoContent();
        }

        [HttpPost("update-score-record-detail")]
        public async Task<ActionResult> UpdateScoreRecordDetail(List<AuditRateDDto> listParms)
        {
            foreach (var item in listParms)
            {
                string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
                if(item.Upload_Picture != null)
                {
                    var source = item.Upload_Picture;
                    string base64 = source.Substring(source.IndexOf(',') + 1);
                    base64 = base64.Trim('\0');
                    byte[] chartData = Convert.FromBase64String(base64);
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    var fileName = item.Record_ID + "_" + item.Audit_Item_ID +".jpg";
                    string filePathB4 = Path.Combine(folder, fileName);
                    System.IO.File.WriteAllBytes(filePathB4, chartData);
                    item.Upload_Picture = fileName;
                }
            }
            if (await _auditRateService.UpdateListScopeRecordDetail(listParms,User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return NoContent();
            }
            throw new Exception("Error Update");
        }
    }


}