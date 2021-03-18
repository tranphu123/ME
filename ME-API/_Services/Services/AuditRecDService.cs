using System;
using System.Collections;
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
using ME_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class AuditRecDService : IAuditRecDService
    {
        private readonly IAuditRecMRepository _repoAuditRecM;
        private readonly IAuditRecDRepository _repoAuditRecD;
        private readonly IAuditTypeRepository _repoAuditTypeM;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IMesAuditOrgRepository _mesAuditOrg;
        private readonly IAuditPicDService _auditPicDService;
        private readonly IAuditPicDRepository _repoAuditPicD;
        public AuditRecDService(IAuditRecDRepository repoAuditRecD,
                                IAuditRecMRepository repoAuditRecM,
                                IAuditTypeRepository repoAuditTypeM,
                                IMapper mapper,
                                IAuditPicDRepository repoAuditPicD,
                                MapperConfiguration configMapper,
                                IMesAuditOrgRepository mesAuditOrg,
                                IAuditPicDService auditPicDService)
        {
            _repoAuditRecD = repoAuditRecD;
            _repoAuditRecM = repoAuditRecM;
            _repoAuditTypeM = repoAuditTypeM;
            _mapper = mapper;
            _repoAuditPicD = repoAuditPicD;
            _configMapper = configMapper;
            _mesAuditOrg = mesAuditOrg;
            _auditPicDService = auditPicDService;
        }
        public Task<bool> Add(AuditRecDDto model)
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> Delete(object id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<AuditRecDDto>> GetAllAsync()
        {
            var lists = await _repoAuditRecD.FindAll().ProjectTo<AuditRecDDto>(_configMapper)
                        .OrderByDescending(x => x.Updated_Time).ToListAsync();
            return lists;
        }

        public async Task<PagedList<AuditRecDto>> GetAllAuditRecViewModel(PaginationParams param)
        {
            var listAuditRecM = _repoAuditRecM.FindAll();
            var listAuditRecD = _repoAuditRecD.FindAll();
            var listAuditMes = _mesAuditOrg.FindAll().Where(x => x.Status == 1);
            // var listAuditRecDto =  (from b in listAuditRecD 
            //                         join a in listAuditRecM on b.Record_ID equals a.Record_ID into c
            //                         from m in c.DefaultIfEmpty()
            //                         select new AuditRecDto()
            //                         {
            //                             Record_ID = m.Record_ID, Record_Time = m.Record_Time,
            //                             Line = m.Line, Model_Name = m.Model_Name,
            //                             Model_No = m.Model_No, Item_no = b.Item_no,
            //                             Status = b.Status, ERCS = b.ERCS,
            //                             //Audit_Type_ID = b.Audit_Type_ID,
            //                             Audit_Type_ID = _repoAuditTypeM.FindById(b.Audit_Type_ID.ToString()).Audit_Type1,
            //                             Audit_Item = b.Audit_Item, Issue_ZW = b.Issue_ZW,
            //                             Issue_LL = b.Issue_LL, Issue_EN = b.Issue_EN,
            //                             Before_Picture = b.Before_Picture, After_Picture = b.After_Picture,
            //                             PD_PIC = b.PD_PIC, PD_RESP = b.PD_RESP,
            //                             ME_PIC = b.ME_PIC, Finished_Date = b.Finished_Date,
            //                             Implement_User = b.Implement_User,Implement_Time = b.Implement_Time
            //                         }).Distinct().OrderByDescending(x => x.Implement_Time);
            var listAuditRecDto = listAuditRecD.Join(listAuditRecM, x => x.Record_ID, y => y.Record_ID, (x, y) => new { x, y })
            .Join(listAuditMes, z => z.y.Line, t => t.Line_ID_2, (z, t)
                    => new AuditRecDto
                    {
                        Record_ID = z.x.Record_ID,
                        Record_Time = z.y.Record_Time,
                        After_Picture = z.x.After_Picture,
                        Audit_Item = z.x.Audit_Item,
                        Audit_Type_ID = z.x.Audit_Type_ID,
                        Audit_Type = z.x.Audit_Type_ID == null || z.x.Audit_Type_ID == "" ? "" : _repoAuditTypeM.FindById(z.x.Audit_Type_ID).Audit_Type1 + "-" + _repoAuditTypeM.FindById(z.x.Audit_Type_ID).Audit_Type2,
                        Before_Picture = z.x.Before_Picture,
                        Finished_Date = z.x.Finished_Date,
                        ERCS = z.x.ERCS,
                        Implement_Time = z.x.Implement_Time,
                        Implement_User = z.x.Implement_User,
                        Issue_EN = z.x.Issue_EN,
                        Issue_LL = z.x.Issue_LL,
                        Issue_ZW = z.x.Issue_ZW,
                        Building = z.y.Building,
                        PDC = z.y.PDC,
                        Line = z.y.Line,
                        Line_Name = t.Line_ID_2_Name,
                        ME_PIC = z.x.ME_PIC,
                        Model_Name = z.y.Model_Name,
                        Model_No = z.y.Model_No,
                        Chief = z.y.Chief,
                        Recorder = z.y.Recorder,
                        Attendees = z.y.Attendees,
                        PD_PIC = z.x.PD_PIC,
                        PD_Department = z.x.PD_Department,
                        PD_Building = z.x.PD_Building,
                        Remark = z.x.Remark,
                        Status = z.x.Status,
                        Item_no = z.x.Item_no,
                        Updated_By = z.x.Updated_By,
                        Updated_Time = z.y.Updated_Time
                    });
            return await PagedList<AuditRecDto>.CreateAsync(listAuditRecDto, param.PageNumber, param.PageSize);
        }
        public async Task<PagedList<AuditRecDto>> SearchByModel(PaginationParams param, AuditRecSearch model)
        {
            var listAuditRecM = _repoAuditRecM.FindAll();
            var listAuditRecD = _repoAuditRecD.FindAll();
            var listAuditMes = _mesAuditOrg.FindAll().Where(x => x.Status == 1);
            var listAuditRecDto = listAuditRecD.Join(listAuditRecM, x => x.Record_ID, y => y.Record_ID, (x, y) => new { x, y })
            .Join(listAuditMes, z => z.y.Line, t => t.Line_ID_2, (z, t)
                    => new AuditRecDto
                    {
                        Record_ID = z.x.Record_ID,
                        Record_Time = z.y.Record_Time,
                        After_Picture = z.x.After_Picture,
                        Audit_Item = z.x.Audit_Item,
                        Audit_Type_ID = z.x.Audit_Type_ID,
                        Audit_Type = z.x.Audit_Type_ID == null || z.x.Audit_Type_ID == "" ? "" : _repoAuditTypeM.FindById(z.x.Audit_Type_ID).Audit_Type1 + "-" + _repoAuditTypeM.FindById(z.x.Audit_Type_ID).Audit_Type2,
                        Before_Picture = z.x.Before_Picture,
                        Finished_Date = z.x.Finished_Date,
                        ERCS = z.x.ERCS,
                        Implement_Time = z.x.Implement_Time,
                        Implement_User = z.x.Implement_User,
                        Issue_EN = z.x.Issue_EN,
                        Issue_LL = z.x.Issue_LL,
                        Issue_ZW = z.x.Issue_ZW,
                        Building = z.y.Building,
                        PDC = z.y.PDC,
                        Line = z.y.Line,
                        Line_Name = t.Line_ID_2_Name,
                        ME_PIC = z.x.ME_PIC,
                        Model_Name = z.y.Model_Name,
                        Model_No = z.y.Model_No,
                        Chief = z.y.Chief,
                        Recorder = z.y.Recorder,
                        Attendees = z.y.Attendees,
                        PD_PIC = z.x.PD_PIC,
                        PD_Department = z.x.PD_Department,
                        PD_Building = z.x.PD_Building,
                        Remark = z.x.Remark,
                        Status = z.x.Status,
                        Item_no = z.x.Item_no,
                        Updated_By = z.x.Updated_By,
                        Updated_Time = z.y.Updated_Time
                    }).Distinct().ToList();
            // listAuditRecDto = listAuditRecDto.Where(x =>    x.Status.Trim() == model.Status.Trim() && 
            //                                                 x.Building.Trim() == model.Building.Trim() &&
            //                                                 x.Line.Trim() == model.Line.Trim() &&
            //                                                 x.PDC.Trim() == model.PDC.Trim() && 
            //                                                 x.Record_Time >= Convert.ToDateTime(model.From_Date + " 00:00") &&
            //                                                 x.Record_Time <= Convert.ToDateTime(model.To_Date + " 00:00"));
           
            if (model.Status != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Status.Trim() == model.Status.Trim()).ToList();
            }
            if (model.Building != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Building.Trim() == model.Building.Trim()).ToList();
            }
            if (model.Line != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Line.Trim() == model.Line.Trim()).ToList();
            }
            if (model.PDC != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.PDC.Trim() == model.PDC.Trim()).ToList();
            }
            if (model.From_Date != "" && model.To_Date != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Record_Time >= Convert.ToDateTime(model.From_Date + " 00:00:00") &&
                                                            x.Record_Time <= Convert.ToDateTime(model.To_Date + " 23:59:59")).ToList();
            }
            if (model.Model_No != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Model_No.Trim() == model.Model_No.Trim()).ToList();
            }
            if (model.Model_Name != "" && model.Model_Name != string.Empty && model.Model_Name != null)
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Model_Name.Contains(model.Model_Name)).ToList();
            }
            if (model.Audit_Type_1 != "")
            {
                var auditTypeMFind = await _repoAuditTypeM.FindAll().Where(x => x.Audit_Type1.Trim() == model.Audit_Type_1 &&
                                                        x.Audit_Type2.Trim() == model.Audit_Type_2).FirstOrDefaultAsync();
                listAuditRecDto = listAuditRecDto.Where(x => x.Audit_Type_ID.Trim() == auditTypeMFind.Audit_Type_ID).ToList();
            }
            listAuditRecDto = listAuditRecDto.Select(x=>{
                x.ME_PIC_Name =GetMePicByID(x.ME_PIC);
                x.PD_PIC_Name = GetPdPicByID(x.PD_PIC);
                return x;
            }).OrderByDescending(x => x.Record_Time).
            ThenBy(x => x.Item_no).ToList();
            return  PagedList<AuditRecDto>.Create(listAuditRecDto, param.PageNumber, param.PageSize);
          
        }

        public Task<bool> Update(AuditRecDDto model)
        {
            throw new System.NotImplementedException();
        }
        public async Task<List<string>> GetAllStatus()
        {
            return await _repoAuditRecD.FindAll().GroupBy(x => x.Status).Select(x => x.Key).ToListAsync();
        }

        public AuditRecDDto GetById(object id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<PagedList<AuditRecDDto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoAuditRecD.FindAll().ProjectTo<AuditRecDDto>(_configMapper)
                        .OrderByDescending(x => x.Updated_Time);
            return await PagedList<AuditRecDDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public Task<PagedList<AuditRecDDto>> Search(PaginationParams param, object text)
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<AuditRecDto>> GetAllExcel()
        {
            var listAuditRecM = _repoAuditRecM.FindAll();
            var listAuditRecD = _repoAuditRecD.FindAll();
            var listAuditRecDto = await listAuditRecD.Join(listAuditRecM, x => x.Record_ID, y => y.Record_ID, (x, y) => new AuditRecDto
            {
                Record_ID = x.Record_ID,
                Record_Time = y.Record_Time,
                After_Picture = x.After_Picture,
                Audit_Item = x.Audit_Item,
                Audit_Type_ID = x.Audit_Type_ID,
                Audit_Type = x.Audit_Type_ID == null || x.Audit_Type_ID == "" ? "" : _repoAuditTypeM.FindById(x.Audit_Type_ID).Audit_Type1 + "-" + _repoAuditTypeM.FindById(x.Audit_Type_ID).Audit_Type2,
                Before_Picture = x.Before_Picture,
                Finished_Date = x.Finished_Date,
                ERCS = x.ERCS,
                Implement_Time = x.Implement_Time,
                Implement_User = x.Implement_User,
                Issue_EN = x.Issue_EN,
                Issue_LL = x.Issue_LL,
                Issue_ZW = x.Issue_ZW,
                Building = y.Building,
                PDC = y.PDC,
                Line = y.Line,
                ME_PIC = x.ME_PIC,
                Model_Name = y.Model_Name,
                Model_No = y.Model_No,
                Chief = y.Chief,
                Recorder = y.Recorder,
                Attendees = y.Attendees,
                PD_PIC = x.PD_PIC,
                PD_Department = x.PD_Department,
                PD_Building = x.PD_Building,
                Remark = x.Remark,
                Status = x.Status,
                Item_no = x.Item_no,
                Updated_By = x.Updated_By,
                Updated_Time = x.Updated_Time
            }).ToListAsync();
            return listAuditRecDto;
        }

          public  string GetMePicByID(string Resp_id)
        {
            var data =  _repoAuditPicD.FindAll().
            Where(x => x.PIC_Type_ID == "1" && x.Status == "1" && x.Resp_ID == Resp_id).FirstOrDefault();

            var Name = Resp_id;
            if (data != null)
            {
                Name = (data.Resp_ID + '_' + data.Resp_ZW + '_' + data.Resp_LL).ToString();
            }

            return Name;
        }
        public  string GetPdPicByID(string Resp_id)
        {
            var data =  _repoAuditPicD.FindAll().
              Where(x => x.PIC_Type_ID == "2" && x.Status == "1" && x.Resp_ID == Resp_id).FirstOrDefault();
            var Name = Resp_id;
            if (data != null)
            {
                Name = (data.Resp_ID + '_' + data.Resp_ZW + '_' + data.Resp_LL).ToString();
            }
            return Name;
        }


        public async Task<List<AuditRecDto>> SearchExcel(AuditRecSearch model,string WT ="1")
        {
            var listAuditRecM = _repoAuditRecM.FindAll();
            var listAuditRecD = _repoAuditRecD.FindAll();
            var listAuditOrg = _mesAuditOrg.FindAll().Where(x => x.Status == 1);
            var listAuditRecDto = await listAuditRecD.Join(listAuditRecM, x => x.Record_ID, y => y.Record_ID, (x, y)
             => new AuditRecDto
            {
                Record_ID = x.Record_ID,
                Record_Time = y.Record_Time,
                After_Picture = x.After_Picture,
                Audit_Item = x.Audit_Item,
                Audit_Type_ID = x.Audit_Type_ID,
                Audit_Type = x.Audit_Type_ID == null || x.Audit_Type_ID == "" ? "" : _repoAuditTypeM.FindById(x.Audit_Type_ID).Audit_Type1 + "-" + _repoAuditTypeM.FindById(x.Audit_Type_ID).Audit_Type2,
                Before_Picture = x.Before_Picture,
                Finished_Date = x.Finished_Date,
                ERCS = x.ERCS,
                Implement_Time = x.Implement_Time,
                Implement_User = x.Implement_User,
                Issue_EN = x.Issue_EN,
                Issue_LL = x.Issue_LL,
                Issue_ZW = x.Issue_ZW,
                PDC = y.PDC,
                PDC_Name = listAuditOrg.Where(t => t.PDC_ID == y.PDC).FirstOrDefault().PDC_Name,
                Line = y.Line,
                Building = y.Building,
                ME_PIC =    x.ME_PIC,
                Model_Name = y.Model_Name,
                Model_No = y.Model_No,
                Chief = y.Chief,
                Recorder = y.Recorder,
                Attendees = y.Attendees,
                PD_PIC =  x.PD_PIC,
                PD_Department = x.PD_Department,
                PD_Building = x.PD_Building,
                Remark = x.Remark,
                Status = x.Status,
                Item_no = x.Item_no,
                Updated_By = x.Updated_By,
                Updated_Time = x.Updated_Time
            }).ToListAsync();
            if(WT !="1"){
                listAuditRecDto =   listAuditRecDto.Select( x=>{
                x.ME_PIC =  GetMePicByID(x.ME_PIC);
                x.PD_PIC =  GetPdPicByID(x.PD_PIC);
                return x;
            }).ToList();

            }
         
            if (model.Status != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Status.Trim() == model.Status.Trim()).ToList();
            }
            if (model.Building != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Building.Trim() == model.Building.Trim()).ToList();
            }
            if (model.Line != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Line.Trim() == model.Line.Trim()).ToList();
            }
            if (model.PDC != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.PDC.Trim() == model.PDC.Trim()).ToList();
            }
             if (model.From_Date != "" && model.To_Date != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Record_Time >= Convert.ToDateTime(model.From_Date + " 00:00:00") &&
                                                            x.Record_Time <= Convert.ToDateTime(model.To_Date + " 23:59:59")).ToList();
            }

            if (model.Model_No != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Model_No.Trim() == model.Model_No.Trim()).ToList();
            }
            if (model.Model_Name != "" && model.Model_Name != string.Empty && model.Model_Name != null)
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Model_Name.Contains(model.Model_Name)).ToList();
            }
            if (model.Audit_Type_1 != "")
            {
                var auditTypeMFind = await _repoAuditTypeM.FindAll().Where(x => x.Audit_Type1.Trim() == model.Audit_Type_1 &&
                                                        x.Audit_Type2.Trim() == model.Audit_Type_2).FirstOrDefaultAsync();
                listAuditRecDto = listAuditRecDto.Where(x => x.Audit_Type_ID.Trim() == auditTypeMFind.Audit_Type_ID).ToList();
            }
            return listAuditRecDto;
        }
        public async Task<bool> AddRecD(AuditRecDDto model)
        {
            MES_Audit_Rec_D auditRecDConvert = _mapper.Map<MES_Audit_Rec_D>(model);
            _repoAuditRecD.Add(auditRecDConvert);
            return await _repoAuditRecD.SaveAll();
        }
        public async Task<bool> UpdateRecD(AuditRecDDto model)

        {
            var auditRecD = _mapper.Map<MES_Audit_Rec_D>(model);
            auditRecD.Updated_Time = DateTime.Now;
            _repoAuditRecD.Update(auditRecD);
            return await _repoAuditRecD.SaveAll();
        }
        public async Task<AuditRecDDto> GetRecDById(string record_ID, int item_no)
        {
            var data = await _repoAuditRecD.FindAll().
                     Where(x => x.Record_ID.Trim() == record_ID.Trim() && x.Item_no == item_no).ToListAsync();
            return _mapper.Map<List<AuditRecDDto>>(data).FirstOrDefault();
        }
        public async Task<AuditRecDDto> GetById(string record_ID)
        {
            var data = await _repoAuditRecD.FindAll().
                     Where(x => x.Record_ID.Trim() == record_ID.Trim()).OrderByDescending(x => x.Item_no).ToListAsync();
            return _mapper.Map<List<AuditRecDDto>>(data).FirstOrDefault();
        }

        public async Task<List<ImproveProjectDto>> ImproveProjectRecordsImplementedRateThisMonth()
        {
            DateTime now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            DateTime d1 = Convert.ToDateTime(startDate.ToString("yyyy/MM/dd") + " 00:00:00");
            DateTime d2 = Convert.ToDateTime(endDate.ToString("yyyy/MM/dd") + " 23:59:59");
            var auditrecM = _repoAuditRecM.FindAll(x=>x.Record_Time>=d1 && x.Record_Time <= d2).Select(x=>x.Record_ID);
            var data = await _repoAuditRecD.FindAll(x=>auditrecM.Contains(x.Record_ID))
                        .GroupBy(x => x.Status)
                        .Select(x => new ImproveProjectDto
                        {
                            Status = x.Key,
                            Qty = x.Count()
                        }).OrderBy(x=>x.Status).ToListAsync();
            return data;
        }

        public async Task<List<ImproveProjectDto>> ImproveProjectRecordsImplementedRateLastMonth()
        {
            // var today = DateTime.Today;
            // var month = new DateTime(today.Year, today.Month, 1);
            // var startDate = month.AddMonths(-1);
            // var endDate = month.AddDays(-1);

            // DateTime d1 = Convert.ToDateTime(startDate.ToString("yyyy/MM/dd") + " 00:00:00");
            // DateTime d2 = Convert.ToDateTime(endDate.ToString("yyyy/MM/dd") + " 23:59:59");
            //sửa lại All data trong page main
            var data = await _repoAuditRecD.FindAll()
                        .GroupBy(x => x.Status)
                        .Select(x => new ImproveProjectDto
                        {
                            Status = x.Key,
                            Qty = x.Count()
                        }).ToListAsync();
            return data;
        }

        public async Task<List<string>> GetListMail(string line)
        {
            var listMail = new List<string>();
            var auditPicDs = await _repoAuditPicD.GetAll().ToListAsync();
            var auditPicID1 = auditPicDs.Where(x => x.PIC_Type_ID == "1" && x.Email.Contains("@shc")).Select(x => x.Email.Trim()).ToList();
            var auditPicID3 = auditPicDs.Where(x => x.PIC_Type_ID == "3" && x.Email.Contains("@shc")).Select(x => x.Email.Trim()).ToList();
            listMail.AddRange(auditPicID1);
            listMail.AddRange(auditPicID3);

            var auditForLine = auditPicDs.Where(x => x.Line.Trim() == line.Trim()).Where(x => x.Email.Contains("@shc")).Select(x => x.Email.Trim()).ToList();
            if(auditForLine.Count > 0) {
                auditForLine.ForEach(item => {
                    if(!listMail.Contains(item)) {
                        listMail.Add(item);
                    }
                });
            }
            return listMail;
        }
    }
}