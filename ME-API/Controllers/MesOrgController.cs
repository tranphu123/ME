using System.Threading.Tasks;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MesOrgController : ControllerBase
    {
        private readonly IMesOrgService _service;
        private readonly IMesAuditOrgService _mesAuditOrgService;
        public MesOrgController(IMesOrgService service, IMesAuditOrgService mesAuditOrgService)
        {
            _mesAuditOrgService = mesAuditOrgService;
            _service = service;
        }

        [HttpGet("allPdc")]
        public async Task<IActionResult> GetAllPdc()
        {
            var data = await _mesAuditOrgService.GetAllPDC();
            return Ok(data);
        }
        [HttpGet("allBuilding")]
        public async Task<IActionResult> GetAllBuilding(string pdc)
        {
            var data = await _mesAuditOrgService.GetAllBuilding(pdc);
            return Ok(data);

        }
        [HttpGet("allLineID")]
        public async Task<IActionResult> GetLineID(string pdc, string building)
        {
            var data = await _mesAuditOrgService.GetAllLineID(pdc, building);
            return Ok(data);

        }

        [HttpPost("show-line")]
        public async Task<IActionResult> GetAllLinePaginations([FromQuery] PaginationParams paginationParams, ShowLineParam showlineParam)
        {
            var data = await _mesAuditOrgService.GetAllLinePaginations(paginationParams, showlineParam);
            Response.AddPagination(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);
            return Ok(data);
        }

        [HttpPost("changeLine")]
        public async Task<bool> changeLine(MesAuditOrgDto auditOrgDto)
        {
             if(await _mesAuditOrgService.Changeline(auditOrgDto))
             {
                 return true;
             }
            return false;
        }

        [HttpGet("allLineIDAuditIsLine")]
        public async Task<IActionResult> GetLineIDIsLine(string pdc, string building, string isLine)
        {
            var data = await _mesAuditOrgService.GetLineIDIsLine(pdc, building, isLine);
            return Ok(data);

        }



    }
}