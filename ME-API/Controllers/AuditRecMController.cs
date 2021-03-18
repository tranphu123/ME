using System;
using System.IO;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuditRecMController : ControllerBase
    {
        private readonly IAuditRecMService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AuditRecMController( IAuditRecMService service,
                                    IWebHostEnvironment webHostEnvironment) {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("all", Name = "GetAllRecM")]
        public async Task<IActionResult> GetAll(){
            var data = await _service.GetAllAsync();
            return Ok(data);
        }
        
        [HttpGet("RecMs" , Name = "GetRecMs")]
        public async Task<IActionResult> GetRecMs([FromQuery]PaginationParams param) {
            var recms = await _service.GetWithPaginations(param);
            Response.AddPagination(recms.CurrentPage, recms.PageSize, recms.TotalCount, recms.TotalPages);
            return Ok(recms);
        }

        [HttpGet("buildings")]
        public async Task<IActionResult> GetAllBuilding() {
            var data = await _service.GetAllBuilding();
            return Ok(data);
        }
        [HttpGet("lines")]
        public async Task<IActionResult> GetAllLine() {
            var data = await _service.GetAllLine();
            return Ok(data);
        }

        [HttpGet("recordIDs")]
        public async Task<IActionResult> GetAllRecordID() {
            var data = await _service.GetAllRecordID();
            return Ok(data);
        }
        
        [HttpGet("modelNames")]
        public async Task<IActionResult> GetAllModelName() {
            var data = await _service.GetAllModelName();
            return Ok(data);
        }
        [HttpGet("modelNos")]
        public async Task<IActionResult> GetAllModelNo() {
            var data = await _service.GetAllModelNo();
            return Ok(data);
        }
        [HttpGet("pdcs")]
        public async Task<IActionResult> GetAllPDC() {
            var data = await _service.GetAllPDC();
            return Ok(data);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(AuditRecMViewModel model)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            model.Updated_By = username;
            if (await _service.AddAuditRecM(model))
            {
                return CreatedAtRoute("GetAllRecM", new { });
            }

            throw new Exception("Creating the Audit Rec M failed on save");
        }
        
        [HttpPost("importExcel/{userName}")]
        public async Task<bool> ImportExcel(IFormFile files,string userName) {
            if (files != null) {
                var file = files;
                var fileName = ContentDispositionHeaderValue
                                .Parse(file.ContentDisposition)
                                .FileName
                                .Trim('"');
                fileName = fileName + "_" + DateTime.Now.ToString().Replace(":", "").Replace("/", "").Replace(" ", "") + ".xlsx";
                string a = _webHostEnvironment.WebRootPath;

                string folder = _webHostEnvironment.WebRootPath +  $@"\uploaded\excels";
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, fileName);
                using (FileStream fs = System.IO.File.Create(filePath)) {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                if (await _service.ImportExcel(filePath,userName))
                {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
        [HttpPost("edit")]
        public async Task<IActionResult> UpdateRecM([FromBody] AuditRecMDto model) {
            
            if (await _service.Update(model))
                return NoContent();
            return BadRequest($"Updating AuditRecM {model.Record_ID} failed on save");
        }
         [HttpGet ("getbyid/{recordID}")]
        public async Task<IActionResult> GetbyId(string recordID){
            var data = await _service.GetRecMById(recordID);
            return Ok(data);
        }
    }
}