using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ME_API.Helpers;
using ME_API._Services.Interface;
using ME_API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ME_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;
        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet(Name = "GetBrands")]
        public async Task<IActionResult> GetBrands([FromQuery]PaginationParams param)
        {
            var brands = await _brandService.GetWithPaginations(param);
            Response.AddPagination(brands.CurrentPage, brands.PageSize, brands.TotalCount, brands.TotalPages);
            return Ok(brands);
        }

        [HttpGet("all", Name = "GetAllBrands")]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _brandService.GetAllAsync();
            return Ok(brands);
        }

        [HttpGet("search/{text}", Name="SearchBrand")]
        public async Task<IActionResult> Search([FromQuery]PaginationParams param, string text)
        {
            var lists = await _brandService.Search(param, text);
            Response.AddPagination(lists.CurrentPage, lists.PageSize, lists.TotalCount, lists.TotalPages);
            return Ok(lists);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBrand(BrandDto brandDto)
        {
            if (await _brandService.CheckBrandExists(brandDto.Brand_ID))
                return BadRequest("Brand ID already exists!");
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            brandDto.Updated_By = username;
            if (await _brandService.Add(brandDto))
            {
                return CreatedAtRoute("GetBrands", new { });
            }

            throw new Exception("Creating the brand failed on save");
        }

        [HttpPost("edit")]
        public async Task<IActionResult> UpdateBrand(BrandDto brandDto)
        {
            if (await _brandService.Update(brandDto))
                return NoContent();
            return BadRequest($"Updating brand {brandDto.Brand_ID} failed on save");
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteBrand(string id)
        {
            if (await _brandService.Delete(id))
                return NoContent();
            throw new Exception("Error deleting the brand");
        }
    }
}