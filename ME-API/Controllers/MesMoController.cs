using System.Threading.Tasks;
using ME_API._Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MesMoController : ControllerBase
    {
        private readonly IMesMoService _service;
        public MesMoController(IMesMoService service) {
            _service = service;
        }

        [HttpGet("allModelNo", Name = "AllModelNo")]
        public async Task<IActionResult> GetAllModelNo() {
            var data = await _service.GetAllModelNo();
            return Ok(data);
        }

        [HttpGet("getModelName/{modelNo}", Name = "GetModelName")]
        public async Task<IActionResult> GetModelName(string modelNo) {
            var modelName = await _service.GetModelName(modelNo);
            return Ok(new {dataResult = modelName});
        }
    }
}