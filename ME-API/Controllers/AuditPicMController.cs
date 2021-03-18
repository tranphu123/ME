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
    public class AuditPicMController : ControllerBase
    {
        private readonly IAuditPicMService _service;
        public AuditPicMController(IAuditPicMService service) {
            _service = service;
        }

        [HttpGet("all", Name = "GetAllPicM")]
        public async Task<IActionResult> GetAll() {
            var model = await _service.GetAllAsync();
            return Ok(model);
        }

        [HttpGet(Name = "GetAuditPicMs")]
        public async Task<IActionResult> GetAuditPicMs([FromQuery]PaginationParams param) 
        {
            var auditPicMs = await _service.GetWithPaginations(param);
            Response.AddPagination(auditPicMs.CurrentPage, auditPicMs.PageSize, auditPicMs.TotalCount, auditPicMs.TotalPages);
            return Ok(auditPicMs);
        }

        [HttpGet("search/{text}")]
        public async Task<IActionResult> Search([FromQuery]PaginationParams param, string text) {
            var lists = await _service.Search(param,text);
            Response.AddPagination(lists.CurrentPage, lists.PageSize, lists.TotalCount, lists.TotalPages);
            return Ok(lists);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(AuditPicMDto auditPicM) {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            auditPicM.Updated_By = username;
            if (await _service.Add(auditPicM)) {

                return CreatedAtRoute("GetAuditPicMs", new {});
            }
            throw new Exception("Creating the Audit PicM failed on save");
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> Delete(string id) {
            if(await _service.Delete(id)) {
                return NoContent();
            }
            throw new Exception("Error deleting the Audit PicM");
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Update([FromBody]AuditPicMDto model) {
            if( await _service.Update(model)) {
                return NoContent();
            }
            return BadRequest($"Updating Audit PicM {model.PIC_Type_ID} failed on save");
        }
    } 
}