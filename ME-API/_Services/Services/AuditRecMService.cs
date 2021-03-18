using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using ME_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace ME_API._Services.Services
{
    public class AuditRecMService : IAuditRecMService
    {
        private readonly IAuditRecMRepository _repoAuditRecM;

        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IAuditRecDRepository _repoAuditRecD;
        private readonly IMesMoRepository _mesMo;
        private readonly IMesAuditOrgRepository _orgRepository;

        public AuditRecMService(IAuditRecMRepository repo,
                                IMapper mapper,
                                MapperConfiguration configMapper,
                                IAuditRecDRepository auditRecD,
                                IMesMoRepository mesMo,
                                IMesAuditOrgRepository orgRepository)
        {
            _repoAuditRecM = repo;
            _mapper = mapper;
            _configMapper = configMapper;
            _repoAuditRecD = auditRecD;
            _mesMo = mesMo;
            _orgRepository = orgRepository;
        }
        public Task<bool> Add(AuditRecMDto model)
        {
            throw new System.NotImplementedException();
        }

        public async Task<bool> AddAuditRecM(AuditRecMViewModel model)
        {
            var recored_Time = DateTime.Parse(model.Record_Time.ToString());
            AuditRecMDto data = new AuditRecMDto();
            data.Record_ID = await this.GetRecordIdRate();
            data.Record_Time = recored_Time;
            data.PDC = model.PDC.Trim();
            data.Building = model.Building.Trim();
            data.Line = model.Line.Trim();
            data.Model_Name = model.Model_Name.Trim();
            data.Model_No = model.Model_No.Trim();
            data.Chief = model.Chief.Trim();
            data.Recorder = model.Recorder.Trim();
            data.Attendees = model.Attendees.Trim();
            data.Updated_By = model.Updated_By.Trim();
            var auditRecMAdd = _mapper.Map<MES_Audit_Rec_M>(data);
            _repoAuditRecM.Add(auditRecMAdd);
            return await _repoAuditRecM.SaveAll();
        }

        public Task<bool> Delete(object id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<AuditRecMDto>> GetAllAsync()
        {
            var lists = await _repoAuditRecM.FindAll().ProjectTo<AuditRecMDto>(_configMapper)
            .OrderByDescending(x => x.Updated_Time).ToListAsync();
            return lists;
        }

        public async Task<List<string>> GetAllBuilding()
        {
            return await _repoAuditRecM.FindAll().GroupBy(x => x.Building).Select(x => x.Key).ToListAsync();
        }

        public async Task<object> GetAllLine()
        {
            var data = await _repoAuditRecM.FindAll().GroupBy(x => x.Line).Select(x => new{line_id =x.Key}).ToListAsync();
            var mesAuditOrg = _orgRepository.FindAll().OrderBy(x=>x.Line_Seq);
            var result = data.Join(mesAuditOrg,x=>x.line_id,y=>y.Line_ID,(x,y)
            => new {
                id = x.line_id,
                text = y.Line_Name
            });
            return result.Distinct();
        }

        public async Task<List<string>> GetAllModelName()
        {
            return await _repoAuditRecM.FindAll().GroupBy(x => x.Model_Name).Select(x => x.Key).ToListAsync();
        }

        public async Task<List<string>> GetAllModelNo()
        {
            return await _repoAuditRecM.FindAll().GroupBy(x => x.Model_No).Select(x => x.Key).ToListAsync();
        }

        public async Task<List<string>> GetAllPDC()
        {
            return await _repoAuditRecM.FindAll().GroupBy(x => x.PDC).Select(x => x.Key).ToListAsync();
        }

        public async Task<object> GetAllRecordID()
        {
            var lists = await _repoAuditRecM.FindAll().Select
            (x => new
            {
                x.Record_ID,
                Record_Time = x.Record_Time == null ? "" : (x.Record_Time.ToString().Substring(0, 10)).Substring(6)
                                     + (x.Record_Time.ToString().Substring(0, 10)).Substring(0, 2)
                                    + ((x.Record_Time.ToString().Substring(0, 10)).Substring(3, 2).Trim().Length == 1 ? "0" +
                                    (x.Record_Time.ToString().Substring(0, 10)).Substring(3, 2).Trim() :
                                    (x.Record_Time.ToString().Substring(0, 10)).Substring(3, 2).Trim())
                                    + (x.Model_No == null ? "" : "_"+x.Model_No)
                                     + (x.Line == null ? "" : "_" + x.Line),
            }).ToListAsync();
            return lists.OrderByDescending(x => x.Record_ID);
        }

        public AuditRecMDto GetById(object id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<string> GetRecordIdRate()
        {
            string record_Id = "RE" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString());
            var item = await _repoAuditRecM.FindAll(x => x.Record_ID.Contains(record_Id)).OrderByDescending(x => x.Record_ID).FirstOrDefaultAsync();
            if (item != null)
            {
                var serinumber = item.Record_ID.Substring(7).ToInt();
                var tmp = (serinumber >= 999) ? (serinumber + 1).ToString() : (serinumber >= 99) ? ("0" + (serinumber + 1)) : (serinumber < 9) ? ("000" + (serinumber + 1)) : ("00" + (serinumber + 1));
                record_Id = "RE" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString()) + tmp;
            }
            else
            {
                record_Id = "RE" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString()) + "0001";
            }
            return record_Id;
        }

        public async Task<PagedList<AuditRecMDto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoAuditRecM.FindAll().ProjectTo<AuditRecMDto>(_configMapper)
                                        .OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditRecMDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public async Task<bool> ImportExcel(string filePath, string userName)
        {
            string record_Id = await GetRecordIdRate();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets[0];
                ExcelWorksheet workSheet2 = package.Workbook.Worksheets[1];


                AuditRecMDto auditRecMDto = new AuditRecMDto();
                for (int i = workSheet.Dimension.Start.Row + 1; i <= workSheet.Dimension.End.Row; i++)
                {
                    auditRecMDto.Record_ID = record_Id;
                    auditRecMDto.Record_Time = Convert.ToDateTime(workSheet.Cells[i, 1].Value.ToString());
                    auditRecMDto.Updated_By = userName;
                    auditRecMDto.PDC = workSheet.Cells[i, 2].Value.ToString();
                    auditRecMDto.Building = workSheet.Cells[i, 3].Value.ToString();
                    auditRecMDto.Line = workSheet.Cells[i, 4].Value.ToString();
                    auditRecMDto.Model_No = workSheet.Cells[i, 5].Value.ToString();
                    auditRecMDto.Model_Name = _mesMo.FindAll().Where(x => x.Style_No.Trim()
                 == (workSheet.Cells[i, 5].Value.ToString()).Trim()).Count() == 0 ? "" :
                  _mesMo.FindAll().Where(x => x.Style_No.Trim()
                  == (workSheet.Cells[i, 5].Value.ToString()).Trim()).FirstOrDefault().Style_Name;
                    var auditRecM = _mapper.Map<MES_Audit_Rec_M>(auditRecMDto);
                    _repoAuditRecM.Add(auditRecM);
                }

                AuditRecDDto auditRecDDto = new AuditRecDDto();
                for (int i = workSheet2.Dimension.Start.Row + 1; i <= workSheet2.Dimension.End.Row; i++)
                {
                    auditRecDDto.Record_ID = record_Id;
                    auditRecDDto.Updated_By = userName;
                    auditRecDDto.Status = "Ongoing";
                    auditRecDDto.Item_no = workSheet2.Cells[i, 1].Value.ToInt();
                    auditRecDDto.Issue_LL = workSheet2.Cells[i, 2].Value.ToString();
                    var auditRecD = _mapper.Map<MES_Audit_Rec_D>(auditRecDDto);
                    _repoAuditRecD.Add(auditRecD);
                }
                try
                {
                    await _repoAuditRecD.SaveAll();
                    return true;
                }
                catch (System.Exception)
                {
                    return false;
                    throw;
                }
            }
        }

        public Task<PagedList<AuditRecMDto>> Search(PaginationParams param, object text)
        {
            throw new System.NotImplementedException();
        }

        public async Task<bool> Update(AuditRecMDto model)
        {
            var auditRecM = _mapper.Map<MES_Audit_Rec_M>(model);
            auditRecM.Updated_Time = DateTime.Now;
            _repoAuditRecM.Update(auditRecM);
            return await _repoAuditRecM.SaveAll();
        }
        public async Task<AuditRecMDto> GetRecMById(string record_ID)
        {
            var data = await _repoAuditRecM.FindAll().
                     Where(x => x.Record_ID.Trim() == record_ID.Trim()).ToListAsync();
            return _mapper.Map<List<AuditRecMDto>>(data).FirstOrDefault();
        }
    }
}