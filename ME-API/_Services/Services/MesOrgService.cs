using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class MesOrgService : IMesOrgService
    {
        private readonly IMesOrgRepository _repo;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public MesOrgService(IMesOrgRepository repo,
                                IMapper mapper,
                                MapperConfiguration configMapper)
        {
            _repo = repo;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<List<MesOrgDto>> GetAllAsync()
        {
            var lists = await _repo.FindAll().ProjectTo<MesOrgDto>(_configMapper).ToListAsync();
            return lists;
        }

        public async Task<List<string>> GetAllBuilding(string pdc)
        {
            var queryData = _repo.FindAll().Where(x => x.Status == 1);
            if (!String.IsNullOrEmpty(pdc))
                queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc.Trim());

            return await queryData.GroupBy(x => x.Building).Select(x => x.Key).ToListAsync();

        }
        public async Task<List<string>> GetAllLineID(string pdc, string building)
        {
            var queryData = _repo.FindAll().Where(x => x.Status == 1);
            if (!String.IsNullOrEmpty(pdc))
            {
                if (!String.IsNullOrEmpty(building))
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc && x.Building.Trim() == building.Trim());
                else
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc);
            }
            return await queryData.GroupBy(x => x.Line_ID_2).Select(x => x.Key.Trim()).ToListAsync();

        }

        public async Task<List<string>> GetAllPDC()
        {
            return await _repo.FindAll().Where(x => x.Status == 1).GroupBy(x => x.PDC_ID).Select(x => x.Key).ToListAsync();

        }

    }
}