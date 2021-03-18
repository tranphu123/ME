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
    public class AuditPicMService : IAuditPicMService
    {
        private readonly IAuditPicMRepository _repo;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public AuditPicMService(IAuditPicMRepository repo,
                                IMapper mapper,
                                MapperConfiguration configMapper)
        {
            _repo = repo;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<bool> Add(AuditPicMDto model)
        {
            var auditPicM = _mapper.Map<MES_Audit_PIC_M>(model);
            //Get max ID
            int maxID = _repo.FindAll().Select(x => x.PIC_Type_ID).Select(int.Parse).ToList().Max();
            auditPicM.PIC_Type_ID = (maxID + 1).ToString();
            _repo.Add(auditPicM);
            return await _repo.SaveAll();

        }

        public async Task<bool> Delete(object id)
        {
            var model = _repo.FindById(id);
            _repo.Remove(model);
            return await _repo.SaveAll();
        }

        public async Task<List<AuditPicMDto>> GetAllAsync()
        {
            return await _repo.FindAll().ProjectTo<AuditPicMDto>(_configMapper).OrderByDescending(x => x.Updated_Time).ToListAsync();
        }

        public AuditPicMDto GetById(object id)
        {
            var auditFind = _repo.FindById(id);
            var model = _mapper.Map<MES_Audit_PIC_M, AuditPicMDto>(auditFind);
            return model;
        }

        public async Task<PagedList<AuditPicMDto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repo.FindAll().ProjectTo<AuditPicMDto>(_configMapper).OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditPicMDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public async Task<PagedList<AuditPicMDto>> Search(PaginationParams param, object text)
        {
            var lists = _repo.FindAll().ProjectTo<AuditPicMDto>(_configMapper)
                .Where(x => x.PIC_Type_ZW.Contains(text.ToString()) ||
                            x.PIC_Type_LL.Contains(text.ToString()) ||
                            x.PIC_Type_EN.Contains(text.ToString()) ||
                            x.PIC_Type_ID.Contains(text.ToString()))
                .OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditPicMDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public async Task<bool> Update(AuditPicMDto model)
        {
            var auditPicM = _mapper.Map<MES_Audit_PIC_M>(model);
            _repo.Update(auditPicM);
            return await _repo.SaveAll();
        }
        public async Task<bool> CheckAuditPicMExists(string picTypeID)
        {
            return await _repo.CheckAuditPicMExists(picTypeID);
        }
    }
}