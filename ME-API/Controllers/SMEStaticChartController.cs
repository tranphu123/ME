using System.Threading.Tasks;
using ME_API._Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SMEStaticChartController : ControllerBase
    {
        private ISMEStaticChartService _iSMEStaticService;

        public SMEStaticChartController(ISMEStaticChartService iSMEStaticService)
        {
            _iSMEStaticService = iSMEStaticService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDataFactoryFree()
        {
            return Ok(await _iSMEStaticService.GetFactoryTree());
        }

        [HttpGet("data-chart")]
        public async Task<IActionResult> GetDataChart(string id , int type)
        {
            return Ok(await _iSMEStaticService.GetDataChart(id,type));
        }
    }
}