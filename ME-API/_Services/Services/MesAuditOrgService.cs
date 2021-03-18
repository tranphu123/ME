using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class MesAuditOrgService : IMesAuditOrgService
    {
        private readonly IMesAuditOrgRepository _mesAuditOrgRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public MesAuditOrgService(IMesAuditOrgRepository mesAuditOrgRepository, IMapper mapper,
                                 MapperConfiguration configMapper)
        {
            _mesAuditOrgRepository = mesAuditOrgRepository;
            _mapper = mapper;
            _configMapper = configMapper;

        }
        public async Task<object> GetAllBuilding(string pdc)
        {
            var queryData = _mesAuditOrgRepository.FindAll().Where(x => x.Status == 1);
            if (!String.IsNullOrEmpty(pdc))
                queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc.Trim());

            return await queryData.GroupBy(x => new { x.Building, x.Building_Name }).Select(x => new { Id = x.Key.Building, Name = x.Key.Building_Name }).ToListAsync();
        }

        public async Task<object> GetAllLineID(string pdc, string building)
        {
            var queryData = _mesAuditOrgRepository.FindAll().Where(x => x.Status == 1);
            if (!String.IsNullOrEmpty(pdc))
            {
                if (!String.IsNullOrEmpty(building))
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc && x.Building.Trim() == building.Trim());
                else
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc);
            }
            return await queryData.GroupBy(x => new { x.Line_ID_2, x.Line_ID_2_Name }).Select(x => new { Id = x.Key.Line_ID_2, Name = x.Key.Line_ID_2_Name }).ToListAsync();
        }

        public async Task<PagedList<MesAuditOrgDto>> GetAllLinePaginations(PaginationParams param, ShowLineParam showlineParam)
        {
            var queryData = _mesAuditOrgRepository.FindAll().Where(x => x.Status == 1);
            if (!String.IsNullOrEmpty(showlineParam.pdc))
            {
                if (!String.IsNullOrEmpty(showlineParam.building))
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == showlineParam.pdc && x.Building.Trim() == showlineParam.building.Trim());
                else
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == showlineParam.pdc);
            }
            var data = queryData.Select(x => new MesAuditOrgDto {
                Line_ID = x.Line_ID,
                Line_Name = x.Line_Name,
                IsWT = x.IsWT == true? true : false,
                IsSME = x.IsSME == true? true : false,
                Is6S = x.Is6S == true? true : false,
                IsWS = x.IsWS == true? true : false
            }).Distinct().OrderBy(x=>x.Line_ID);
            return await PagedList<MesAuditOrgDto>.CreateAsync(data, param.PageNumber, param.PageSize);
        }

        public async Task<object> GetAllPDC()
        {
            return await _mesAuditOrgRepository.FindAll().Where(x => x.Status == 1).GroupBy(x => new { x.PDC_ID, x.PDC_Name }).Select(x => new {Id = x.Key.PDC_ID, Name = x.Key.PDC_Name}).ToListAsync();
        }

         public async Task<object> GetLineIDIsLine(string pdc, string building, string isLine)
        {
            var queryData = _mesAuditOrgRepository.FindAll();
            if(isLine == "isWT") {
                queryData = queryData.Where(x => x.IsWT == true &&  x.Status == 1);
            }
            if(isLine == "isSME") {
                queryData = queryData.Where(x => x.IsSME == true &&  x.Status == 1);
            }
            if(isLine == "is6S") {
                queryData = queryData.Where(x => x.Is6S == true &&  x.Status == 1);
            } 
            if(isLine == "isWS") {
                queryData = queryData.Where(x => x.IsWS == true &&  x.Status == 1);
            }
            if (!String.IsNullOrEmpty(pdc))
            {
                if (!String.IsNullOrEmpty(building))
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc && x.Building.Trim() == building.Trim());
                else
                    queryData = queryData.Where(x => x.PDC_ID.Trim() == pdc);
            }
            return await queryData.GroupBy(x => new { x.Line_ID, x.Line_Name }).Select(x => new { Id = x.Key.Line_ID, Name = x.Key.Line_Name }).ToListAsync();
        }


        public async Task<bool> Changeline(MesAuditOrgDto auditOrgDto)
        {  
                var data = _mesAuditOrgRepository.FindAll(x=>x.Line_ID.Trim() == auditOrgDto.Line_ID.Trim()).ToList();
                data = data.Select(x=>{
                     x.IsWT = auditOrgDto.IsWT;
                     x.IsSME = auditOrgDto.IsSME;
                     x.Is6S = auditOrgDto.Is6S;
                     x.IsWS = auditOrgDto.IsWS;
                    return x;
                }).ToList();
                try
                {
                    await _mesAuditOrgRepository.SaveAll();
                    return true;
                }
                catch (System.Exception)
                {
                    return false;
                    throw;
                }
        }
    }
}