using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ME_API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Models;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _repoBrand;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public BrandService(IBrandRepository repoBrand, IMapper mapper, MapperConfiguration configMapper)
        {
            _configMapper = configMapper;
            _mapper = mapper;
            _repoBrand = repoBrand;

        }

        //Thêm Brand mới vào bảng MES_Audit_Brand
        public async Task<bool> Add(BrandDto model)
        {
            var brand = _mapper.Map<MES_Audit_Brand>(model);
            _repoBrand.Add(brand);
            return await _repoBrand.SaveAll();
        }

        //Kiểm tra Brand_ID đã tồn tại hay chưa
        public async Task<bool> CheckBrandExists(string brandId)
        {
            return await _repoBrand.CheckBrandExists(brandId);
        }

        //Lấy danh sách Brand và phân trang
        public async Task<PagedList<BrandDto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoBrand.FindAll().ProjectTo<BrandDto>(_configMapper).OrderByDescending(x => x.Updated_Time);
            return await PagedList<BrandDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        //Tìm kiếm brand
        public async Task<PagedList<BrandDto>> Search(PaginationParams param, object text)
        {
            var lists = _repoBrand.FindAll().ProjectTo<BrandDto>(_configMapper)
            .Where(x => x.Brand_ID.Contains(text.ToString()) || x.Brand_EN.Contains(text.ToString()) || x.Brand_LL.Contains(text.ToString()) || x.Brand_ZW.Contains(text.ToString()))
            .OrderByDescending(x => x.Updated_Time);
            return await PagedList<BrandDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        
        //Xóa Brand
        public async Task<bool> Delete(object id)
        {
            var brand = _repoBrand.FindById(id);
            _repoBrand.Remove(brand);
            return await _repoBrand.SaveAll();
        }

        //Cập nhật Brand
        public async Task<bool> Update(BrandDto model)
        {
            var brand = _mapper.Map<MES_Audit_Brand>(model);
            brand.Updated_Time = DateTime.Now;
            _repoBrand.Update(brand);
            return await _repoBrand.SaveAll();
        }

        //Lấy toàn bộ danh sách Brand 
        public async Task<List<BrandDto>> GetAllAsync()
        {
            return await _repoBrand.FindAll().ProjectTo<BrandDto>(_configMapper).OrderByDescending(x => x.Updated_Time).ToListAsync();
        }

        //Lấy Brand theo Brand_Id
        public BrandDto GetById(object id)
        {
            return  _mapper.Map<MES_Audit_Brand, BrandDto>(_repoBrand.FindById(id));
        }

    }
}