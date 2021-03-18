using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using ME_API.ViewModel;
using Microsoft.EntityFrameworkCore;
namespace ME_API._Services.Services
{
    public class ChartByMonthlyService : IChartByMonthlyService
    {
        private readonly IAuditRecMRepository _repoAuditRecM;
        private readonly IAuditRecDRepository _repoAuditRecD;
        private readonly IAuditTypeRepository _repoAuditTypeM;
        private readonly IMesAuditOrgRepository _mesAuditOrg;
        private readonly IAuditPicDRepository _repoAuditPicD;

        public ChartByMonthlyService(IAuditRecMRepository repoAuditRecM,
                            IAuditRecDRepository repoAuditRecD,
                            IAuditTypeRepository repoAuditTypeM,
                            IMesAuditOrgRepository mesAuditOrg,
                            IAuditPicDRepository repoAuditPicD
                            )
        {
            _repoAuditRecM = repoAuditRecM;
            _repoAuditRecD = repoAuditRecD;
            _repoAuditTypeM = repoAuditTypeM;
            _mesAuditOrg = mesAuditOrg;
            _repoAuditPicD = repoAuditPicD;
        }

        public class DataChart
        {
            public string name { get; set; }
            public List<int?> data { get; set; }
        }
        public async Task<object> GetChart(ChartMonthlyParam param)
        {
            var auditRecMs = await _repoAuditRecM.GetAll().ToListAsync();
            var auditRecDs = await _repoAuditRecD.GetAll().ToListAsync();
            var auditTypeMs = await _repoAuditTypeM.GetAll().ToListAsync();

            if (param.FromDate != "" && param.ToDate != "")
            {
                auditRecMs = auditRecMs.Where(x => x.Record_Time >= Convert.ToDateTime(param.FromDate) &&
                    x.Record_Time <= Convert.ToDateTime(param.ToDate + " 23:59:59.997")).ToList();
            }
            if (param.Status != "" && param.Status != "All")
            {
                auditRecDs = auditRecDs.Where(x => x.Status.Trim() == param.Status.Trim()).ToList();
            }
             if (param.Line != "" && param.Line != "All")
            {
                auditRecMs = auditRecMs.Where(x => x.Line.Trim() == param.Line.Trim()).ToList();
            }
            if (param.Model_No != "" && param.Model_No != "All")
            {
                auditRecMs = auditRecMs.Where(x => x.Model_No.Trim() == param.Model_No.Trim()).ToList();
            }
            if (param.Type != "" && param.Type != "All")
            {
                //  Lấy AuditTypeM Có Version lớn nhất
                var auditTypeM = auditTypeMs.Where(x => x.Audit_Type_ID.Trim() == param.Type.Trim()).FirstOrDefault();
                var auditTypeMVersion = auditTypeMs.Where(x => x.Audit_Kind == auditTypeM.Audit_Kind &&
                                        x.Audit_Type1 == auditTypeM.Audit_Type1 &&
                                        x.Audit_Type2 == auditTypeM.Audit_Type2)
                                        .OrderByDescending(x => x.Version).FirstOrDefault();
                auditTypeMs = auditTypeMs.Where(x => x.Audit_Type_ID.Trim() == auditTypeMVersion.Audit_Type_ID.Trim()).ToList();
            }
            var data1 = (from a in auditRecMs join b in auditRecDs
                            on a.Record_ID.Trim() equals b.Record_ID.Trim()
                            select new {
                                Line = a.Line,
                                Item_no = b.Item_no,
                                Model_No = a.Model_No,
                                Audit_Type_ID = b.Audit_Type_ID
                            }).ToList();
            var data2 = (from a in data1 join b in auditTypeMs
                            on a.Audit_Type_ID equals b.Audit_Type_ID
                            into cl
                            from d in cl.DefaultIfEmpty()
                            select new ChartByMonthly(){
                                Line = a.Line,
                                Model_No = a.Model_No,
                                Item_no = a.Item_no,
                                Audit_Type1 = d == null ? null : d.Audit_Type1,
                                Audit_Type2 = d == null ? null : d.Audit_Type2,
                            });
            var data3 = data2.GroupBy(x => new { x.Line, x.Model_No, x.Audit_Type1, x.Audit_Type2 })
                .Select(y => new ChartByMonthly() {
                        Line = y.FirstOrDefault().Line,
                        Model_No = y.FirstOrDefault().Model_No,
                        Audit_Type = ((y.FirstOrDefault().Audit_Type1 == null) ? "Other" : y.FirstOrDefault().Audit_Type1) + "-" + y.FirstOrDefault().Audit_Type2,
                        Count = y.Count()
                    }).ToList();
            var lineModelGroup = data3.GroupBy(x => x.Line_ModelNo).Select(x => x.Key).ToList();
            var auditTypeGroup = data3.GroupBy(x => x.Audit_Type).Select(x => x.Key).ToList();
            var dataResult = new List<DataChart>();
            auditTypeGroup.ForEach(item => {
                var itemChart = new DataChart();
                itemChart.name = item;
                var data4 = new List<int?>();
                foreach (var item1 in lineModelGroup) {
                    var ts = data3.Where(x => x.Line_ModelNo == item1 && x.Audit_Type == item)
                        .GroupBy(x => new { x.Line_ModelNo, x.Audit_Type }).Select(x => x.Sum(cl => cl.Count)).FirstOrDefault();
                    if (ts != 0){
                        data4.Add(ts);
                    } else {
                        data4.Add(null);
                    }
                }
                itemChart.data = data4;
                dataResult.Add(itemChart);
            });

            var result = new {
                dataChart = dataResult,
                titleX = lineModelGroup,
                columnName = auditTypeGroup
            };
            return result;
        }

        public async Task<List<MES_Audit_Type_M>> GetTypes()
        {
            var data = await _repoAuditTypeM.GetAll().Distinct().ToListAsync();
            return data;
        }

        public async Task<object> GetChartPreviousMonth()
        {
            var auditRecMs = await _repoAuditRecM.GetAll().ToListAsync();
            var auditRecDs = await _repoAuditRecD.GetAll().ToListAsync();
            var auditTypeMs = await _repoAuditTypeM.GetAll().ToListAsync();
            
            // Lấy khoảng thời gian của tháng trước.
            DateTime timeNow = DateTime.Now;
            DateTime startDate = DateTime.Now; 
            //kiểm tra tháng 1
            if(timeNow.Month-1 ==0)
            {
            startDate =new DateTime(timeNow.Year-1,12, 1);
            }
            else
            {
             startDate = new DateTime(timeNow.Year, timeNow.Month-1, 1);
            }
             var endDate = startDate.AddMonths(1).AddDays(-1);
            DateTime d1 = Convert.ToDateTime(startDate.ToString("yyyy/MM/dd") + " 00:00:00");
            DateTime d2 = Convert.ToDateTime(endDate.ToString("yyyy/MM/dd") + " 23:59:59");
            auditRecMs = auditRecMs.Where(x => x.Record_Time >= d1 && x.Record_Time <= d2).ToList();
            
            var data1 = (from a in auditRecMs join b in auditRecDs
                            on a.Record_ID.Trim() equals b.Record_ID.Trim()
                            select new {
                                Line = a.Line,
                                Item_no = b.Item_no,
                                Model_No = a.Model_No,
                                Audit_Type_ID = b.Audit_Type_ID
                            }).ToList();
            var data2 = (from a in data1 join b in auditTypeMs
                            on a.Audit_Type_ID equals b.Audit_Type_ID
                            into cl
                            from d in cl.DefaultIfEmpty()
                            select new ChartByMonthly(){
                                Line = a.Line,
                                Model_No = a.Model_No,
                                Item_no = a.Item_no,
                                Audit_Type1 = d == null ? null : d.Audit_Type1,
                                Audit_Type2 = d == null ? null : d.Audit_Type2,
                            });
            var data3 = data2.GroupBy(x => new { x.Line, x.Model_No, x.Audit_Type1, x.Audit_Type2 })
                .Select(y => new ChartByMonthly() {
                        Line = y.FirstOrDefault().Line,
                        Model_No = y.FirstOrDefault().Model_No,
                        Audit_Type = ((y.FirstOrDefault().Audit_Type1 == null) ? "Other" : y.FirstOrDefault().Audit_Type1) + "-" + y.FirstOrDefault().Audit_Type2,
                        Count = y.Count()
                    }).ToList();
            var lineModelGroup = data3.GroupBy(x => x.Line_ModelNo).Select(x => x.Key).ToList();
            var auditTypeGroup = data3.GroupBy(x => x.Audit_Type).Select(x => x.Key).ToList();
            var dataResult = new List<DataChart>();
            auditTypeGroup.ForEach(item => {
                var itemChart = new DataChart();
                itemChart.name = item;
                var data4 = new List<int?>();
                foreach (var item1 in lineModelGroup) {
                    var ts = data3.Where(x => x.Line_ModelNo == item1 && x.Audit_Type == item)
                        .GroupBy(x => new { x.Line_ModelNo, x.Audit_Type }).Select(x => x.Sum(cl => cl.Count)).FirstOrDefault();
                    if (ts != 0){
                        data4.Add(ts);
                    } else {
                        data4.Add(null);
                    }
                }
                itemChart.data = data4;
                dataResult.Add(itemChart);
            });

            var result = new {
                dataChart = dataResult,
                titleX = lineModelGroup,
                columnName = auditTypeGroup
            };
            return result;
        }
    
    //export excel
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
                Name = (data.Resp_ID + '_' + data.Resp_LL + '_' + data.Resp_ZW  ).ToString();
            }
            return Name;
        }

         public async Task<List<AuditRecDto>> SearchExcel(AuditRecSearch model)
        {
            var auditTypeMs = await _repoAuditTypeM.GetAll().ToListAsync();
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
            
                listAuditRecDto =   listAuditRecDto.Select( x=>{
                x.ME_PIC =  GetMePicByID(x.ME_PIC);
                x.PD_PIC =  GetPdPicByID(x.PD_PIC);
                return x;
            }).ToList();

            if (model.Status != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Status.Trim() == model.Status.Trim()).ToList();
            }
            if (model.Line != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Line.Trim() == model.Line.Trim()).ToList();
            }
            if (model.From_Date != "" && model.To_Date != "")
            {
                listAuditRecDto = listAuditRecDto.Where(x => x.Record_Time >= Convert.ToDateTime(model.From_Date + " 00:00") &&
                                                            x.Record_Time <= Convert.ToDateTime(model.To_Date + " 00:00")).ToList();
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
              //  Lấy AuditTypeM Có Version lớn nhất
                var auditTypeM = auditTypeMs.Where(x => x.Audit_Type_ID.Trim() == model.Audit_Type_1.Trim()).FirstOrDefault();
                var auditTypeMVersion = auditTypeMs.Where(x => x.Audit_Kind == auditTypeM.Audit_Kind &&
                                        x.Audit_Type1 == auditTypeM.Audit_Type1 &&
                                        x.Audit_Type2 == auditTypeM.Audit_Type2)
                                        .OrderByDescending(x => x.Version).FirstOrDefault();
             listAuditRecDto = listAuditRecDto.Where(x => x.Audit_Type_ID.Trim() == auditTypeMVersion.Audit_Type_ID).ToList();
            }
            return listAuditRecDto;
        }

    }
}