using System.Threading.Tasks;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieQueryManagementController:ControllerBase
    {
        private readonly IMovieQueryManagementService _movieQueryManagementService;

        public MovieQueryManagementController(IMovieQueryManagementService movieQueryManagementService)
        {
            _movieQueryManagementService = movieQueryManagementService;
        }
        [HttpGet("getAllVersion")]
        public async Task<IActionResult> GetAllVersion(string brand)
        {
            var list =await _movieQueryManagementService.GetVersion(brand);
            return Ok(list);
        }
         [HttpGet("getAllAuditItem")]
        public async Task<IActionResult> GetAllAuditItem(string audittypeID)
        {
            var list =await _movieQueryManagementService.GetAuditItem(audittypeID);
            return Ok(list);
        }
         [HttpGet("getAllAudittype")]
        public async Task<IActionResult> GetAllAudittype(string brand)
        {
            var list =await _movieQueryManagementService.GetAllAudittype(brand);
            return Ok(list);
        }
         [HttpPost("moviequerylist")]
        public async Task<IActionResult> SeachMoviequerylist( [FromQuery] PaginationParams param,MovieQueryDto movieQueryDto)
        {   
            var list =await _movieQueryManagementService.SeachMoviequerylist(param,movieQueryDto);
            Response.AddPagination(list.CurrentPage, list.PageSize, list.TotalCount, list.TotalPages);
            return Ok(list);
        }
    }
}