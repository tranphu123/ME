using System.Collections.Generic;
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
    public class MesUserController : ControllerBase
    {
        private readonly IMesUserService _mesUserService;

        public MesUserController(IMesUserService mesUserService)
        {
            _mesUserService = mesUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMesUser([FromQuery] PaginationParams param)
        {
            var mesUser = await _mesUserService.GetWithPaginations(param);
            Response.AddPagination(mesUser.CurrentPage, mesUser.PageSize, mesUser.TotalCount, mesUser.TotalPages);
            return Ok(mesUser);
        }



        [HttpGet("search/{text}", Name = "SearchMesUser")]
        public async Task<IActionResult> SearchMesUser([FromQuery] PaginationParams param, string text)
        {
            param.PageNumber = 1;
            var lists = await _mesUserService.Search(param, text);
            Response.AddPagination(lists.CurrentPage, lists.PageSize, lists.TotalCount, lists.TotalPages);
            return Ok(lists);
        }
        [HttpGet("roleUser/{user}")]
        public async Task<IActionResult> GetRoleByUser(string user)
        {
             var lists = await _mesUserService.GetRoleByUser( user);
             return Ok(lists);
        }
         [HttpPost("saverole")]
        public async Task<bool> saveRole(List<AuditRoleSaveDto> auditRoleUser)
        {
             var userName = User.FindFirst(ClaimTypes.NameIdentifier).Value;
             if(await _mesUserService.saveRole( auditRoleUser,userName))
             {
                 return true;
             }
            return false;
        }

    }
}