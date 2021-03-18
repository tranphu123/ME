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
using System;
using ME_API.Data;

namespace ME_API._Services.Services
{
    public class AuditTypeDService : IAuditTypeDService
    {
        private readonly IAuditTypeDRepository _repoAuditDType;
        private readonly IAuditTypeRepository _repoAuditMType;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public AuditTypeDService(IAuditTypeDRepository repoAuditDType,
                                    IAuditTypeRepository repoAuditMType,
                                    IMapper mapper,
                                    MapperConfiguration configMapper,
                                    DataContext db)
        {
            _configMapper = configMapper;
            _mapper = mapper;
            _repoAuditDType = repoAuditDType;
            _repoAuditMType = repoAuditMType;
        }
        public async Task<bool> Add(AuditType_D_Dto model)
        {
            var auditType = _mapper.Map<MES_Audit_Type_D>(model);
            _repoAuditDType.Add(auditType);
            return await _repoAuditDType.SaveAll();
        }

        public Task<bool> Delete(object id)
        {
            // var model = _repoAuditDType.FindById(id);
            // _repoAuditDType.Remove(model);
            // return await _repoAuditDType.SaveAll();
            throw new System.NotImplementedException();
        }

        public async Task<List<AuditType_D_Dto>> GetAllAsync()
        {
            return await _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper).OrderByDescending(x => x.Updated_Time).ToListAsync();
        }

        public AuditType_D_Dto GetById(object id)
        {
            return _mapper.Map<MES_Audit_Type_D, AuditType_D_Dto>(_repoAuditDType.FindById(id));
        }

        public async Task<PagedList<AuditType_D_Dto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper).OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditType_D_Dto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        public async Task<PagedList<AuditType_D_Dto>> Search(PaginationParams param, object text)
        {
            var lists = _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper).Where(x => x.Audit_Type_ID.Trim() == text.ToString().Trim()).OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditType_D_Dto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public async Task<List<string>> SearchAuditItem(string auditTypeID)
        {
            return await _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper)
            .Where(x => x.Audit_Type_ID.Trim() == auditTypeID.Trim())
            .OrderByDescending(x => x.Updated_Time).Select(x => x.Audit_Item_ID).ToListAsync();
        }

        public async Task<PagedList<AuditType_D_Dto>> SearchByAuditType(PaginationParams param, string audit_Type1, string audit_Type2)
        {
            MES_Audit_Type_M auditTypeID = null;
            var lists = _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper);
            if (audit_Type1 != "all")
            {
                if (audit_Type2 != null)
                {
                    auditTypeID = await _repoAuditMType.FindAll().Where(x => x.Audit_Type1.Trim() == audit_Type1.Trim() && x.Audit_Type2.Trim() == audit_Type2).FirstOrDefaultAsync();
                }
                else
                {
                    auditTypeID = await _repoAuditMType.FindAll().Where(x => x.Audit_Type1.Trim() == audit_Type1.Trim()).FirstOrDefaultAsync();
                }
                lists = _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper).Where(x => x.Audit_Type_ID.Trim() == auditTypeID.Audit_Type_ID.Trim()).OrderByDescending(x => x.Updated_Time);
            }
            return await PagedList<AuditType_D_Dto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        public async Task<bool> Update(AuditType_D_Dto model)
        {
            var auditType = _mapper.Map<MES_Audit_Type_D>(model);
            auditType.Updated_Time = DateTime.Now;
            _repoAuditDType.Update(auditType);
            return await _repoAuditDType.SaveAll();
        }

        public async Task<bool> ChangeVisiable(string ID, string item)
        {
            var model = _repoAuditDType.Get_Audit_Type_D(ID, item);
            model.Visible = !model.Visible;
            var modelRepo = _mapper.Map<MES_Audit_Type_D>(model);
            _repoAuditDType.Update(modelRepo);
            return await _repoAuditDType.SaveAll();
        }

        public async Task<PagedList<AuditType_D_Dto>> SearchAuditTypeD(PaginationParams param, AuditTypeDParam auditTypeDParam)
        {
            var query = _repoAuditDType.FindAll();
            MES_Audit_Type_M auditTypeID = new MES_Audit_Type_M();

            if (!String.IsNullOrEmpty(auditTypeDParam.audit_Type_1))
            {
                if (!String.IsNullOrEmpty(auditTypeDParam.audit_Type_2))
                {
                    auditTypeID = await _repoAuditMType.FindAll().Where(x => x.Audit_Type1.Trim()
                     == auditTypeDParam.audit_Type_1.Trim() && x.Audit_Type2.Trim() == auditTypeDParam.audit_Type_2).
                    OrderByDescending(x => x.Audit_Type_ID).FirstOrDefaultAsync();
                }
                else
                {
                    auditTypeID = await _repoAuditMType.FindAll().Where(x => x.Audit_Type1.Trim()
                     == auditTypeDParam.audit_Type_1.Trim()).FirstOrDefaultAsync();
                }
                query = query.Where(x => x.Audit_Type_ID.Trim() == auditTypeID.Audit_Type_ID.Trim());
            }
            var result = await _repoAuditMType.FindAll().ToListAsync();
            var data = (from a in result
                        select new
                        {
                            audit_Type_ID = result.Where(y => y.Audit_Kind == a.Audit_Kind && y.Audit_Type1 == a.Audit_Type1
                              && y.Audit_Type2 == a.Audit_Type2 && y.Brand == a.Brand &&
                              y.Version == result.Where(x => x.Audit_Kind == a.Audit_Kind && x.Audit_Type1 == a.Audit_Type1
                              && x.Audit_Type2 == a.Audit_Type2 && x.Brand == a.Brand).OrderByDescending(x => x.Version).FirstOrDefault().Version)
                        .OrderByDescending(x => x.Audit_Type_ID).FirstOrDefault().Audit_Type_ID,
                        }).ToList();
            var dataTest = data.Select(x => x.audit_Type_ID).ToList();
            query = query.Where(x => dataTest.Contains(x.Audit_Type_ID));
            var list = query.ProjectTo<AuditType_D_Dto>(_configMapper).OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditType_D_Dto>.CreateAsync(list, param.PageNumber, param.PageSize);
        }
        public async Task<object> getAllAuditTypeM()
        {
            var result = await _repoAuditMType.FindAll().ToListAsync();
            var data = from a in result
                       select new
                       {
                           audit_Type_ID = result.Where(y => y.Audit_Kind == a.Audit_Kind && y.Audit_Type1 == a.Audit_Type1
                            && y.Audit_Type2 == a.Audit_Type2 && y.Brand == a.Brand &&
                            y.Version == result.Where(x => x.Audit_Kind == a.Audit_Kind && x.Audit_Type1 == a.Audit_Type1
                            && x.Audit_Type2 == a.Audit_Type2 && x.Brand == a.Brand).OrderByDescending(x => x.Version).FirstOrDefault().Version)
                       .OrderByDescending(x => x.Audit_Type_ID).FirstOrDefault().Audit_Type_ID,
                            Audit_Kind = a.Audit_Kind==null?"":a.Audit_Kind,
                           Audit_Type1 = a.Audit_Type1==null?"":a.Audit_Type1,
                           Audit_Type2 = a.Audit_Type2 ==null?"":a.Audit_Type2,
                           Version = result.Where(x => x.Audit_Kind == a.Audit_Kind && x.Audit_Type1 == a.Audit_Type1
                           && x.Audit_Type2 == a.Audit_Type2 && x.Brand == a.Brand).OrderByDescending(x => x.Version).FirstOrDefault().Version
                       };
            return data.Distinct();
        }
        public string GetNameVideoByID(string audit_Type_ID)
        {
            var data =  _repoAuditMType.FindAll().Where(x=>x.Audit_Type_ID.Trim() == audit_Type_ID).ToList();
            var result = (from a in data
                        select new{
                            Name = a.Brand+'-'+ a.Audit_Kind +'-'+a.Audit_Type1
                        }).ToList();
        return result[0].Name;
        }
    }
}