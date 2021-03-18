using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class AuditPicDController : ControllerBase
    {
        private readonly IAuditPicDService _service;
        public AuditPicDController(IAuditPicDService service) {
            _service = service;
        }
        
        [HttpGet("all", Name = "GetAllPicD")]
        public async Task<IActionResult> GetAll() {
            var models = await _service.GetAllAsync();
            return Ok(models);
        }

        [HttpGet("search/{text}")]
        public async Task<IActionResult> Search([FromQuery]PaginationParams param,string text) {
            var lists = await _service.Search(param,text);
            Response.AddPagination(lists.CurrentPage, lists.PageSize, lists.TotalCount, lists.TotalPages);
            return Ok(lists);
        }

        [HttpGet(Name = "GetAuditPicDs")]
        public async Task<IActionResult> GetAuditPicDs([FromQuery]PaginationParams param) {
            var auditPicDs = await _service.GetWithPaginations(param);
            Response.AddPagination(auditPicDs.CurrentPage, auditPicDs.PageSize, auditPicDs.TotalCount, auditPicDs.TotalPages);
            return Ok(auditPicDs);
        }

        [HttpGet("allPdPic")]
        public async Task<IActionResult> GetAllPdPic() {
            var data = await _service.GetAllPdPic();
            return Ok(data);
        }

        [HttpGet("getPdDepartment/{pdc}", Name = "getPdDepartment")]
        public async Task<IActionResult> GetPdDepartment(string pdc) {
            var data = await _service.GetPdDepartment(pdc);
            return Ok(new {dataResult = data});
        }

        [HttpGet("getPdBuilding/{pdc}", Name = "getPdBuilding")]
        public async Task<IActionResult> GetPdBuilding(string pdc) {
            var data = await _service.GetPdBuilding(pdc);
            return Ok (new {dataResult = data});
        }


        [HttpGet("allMePic")]
        public async Task<IActionResult> GetAllMePic() {
            var data = await _service.GetAllMePic();
            return Ok(data);
        }

         [HttpGet("GetPdPicByID/{Resp_id}")]
        public async Task<IActionResult> GetPdPicByID(string Resp_id) {
            var data = await _service.GetPdPicByID(Resp_id);
            return Ok(new {dataResult = data});
        }
         [HttpGet("GetMePicByID/{Resp_id}")]
        public async Task<IActionResult> GetMePicByID(string Resp_id) {
            var data = await _service.GetMePicByID(Resp_id);
            return Ok(new {dataResult = data});
        }
         [HttpGet("GetBuidingByID/{Buiding}")]
        public async Task<IActionResult> GetBuidingByID(string Buiding) {
            var data = await _service.GetBuidingByID(Buiding);
            return Ok(new {dataResult = data});
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(AuditPicDDto data) {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            data.Updated_By = username;
            if (await _service.Add(data)) {
                return CreatedAtRoute("GetAuditPicDs", new {});
            }
            throw new Exception("Creating the Audit PicD failed on save");
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody]AuditPicDDto model) {
            if (await _service.Delete(model)) {
                return NoContent();
            }
            throw new Exception("Error deleting the Audit PicD");
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Update([FromBody]AuditPicDDto model) {
            if (await _service.Update(model)) {
                return NoContent();
            }
            return BadRequest($"Updating Audit PicD {model.PIC_Type_ID} failed on save");
        }
    }
}