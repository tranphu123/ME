using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class SMEStaticChartService : ISMEStaticChartService
    {
        private ISMERecordService _iSMEReocrdService;
        private readonly IMesAuditOrgRepository _iMesAuditrepo;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IAuditRateDRepository _rateDRepository;
        private readonly IAuditRateMRepository _rateMRepository;
        private readonly IAuditTypeDRepository _typeDRepository;

        public SMEStaticChartService(ISMERecordService iSMEReocrdService,
                                 IMesAuditOrgRepository iMesAuditrepo,
                                  IMapper mapper,
                                   MapperConfiguration configMapper,
                                   IAuditRateDRepository rateDRepository,
                                   IAuditRateMRepository rateMRepository,
                                   IAuditTypeDRepository typeDRepository)
        {
            _iSMEReocrdService = iSMEReocrdService;
            _iMesAuditrepo = iMesAuditrepo;
            _mapper = mapper;
            _configMapper = configMapper;
            _rateDRepository = rateDRepository;
            _rateMRepository = rateMRepository;
            _typeDRepository = typeDRepository;
        }

        public async Task<SMEStaticChartDto> GetFactoryTree()
        {
            var dataQuery = await _iMesAuditrepo.FindAll(x => x.Status == 1 && x.PDC_ID != "6" &&
            x.PDC_ID != "8" && x.PDC_ID != "C" && x.PDC_ID != "D" && x.PDC_ID != "G").ToListAsync();
            SMEStaticChartDto result = new SMEStaticChartDto();
            result.Factory = "SHC";
            var dataGroup = dataQuery.GroupBy(x => new { x.PDC_ID, x.PDC_Name});

            foreach (var itemPDC in dataGroup)
            {
                PDC pdc = new PDC();
                pdc.PDCName = itemPDC.Key.PDC_Name;
                pdc.PDC_ID = itemPDC.Key.PDC_ID;
                var listBuilding = dataQuery.Where(x => x.PDC_ID == itemPDC.Key.PDC_ID).ToList()
                .GroupBy(x => new {Building= x.Building.Trim() ,Building_Name= x.Building_Name.Trim()});
                listBuilding = listBuilding.OrderBy(x=>x.Key.Building);
                if(listBuilding.Count()!=0)
                {
                     foreach (var itemBuilding in listBuilding)
                {
                    Builing building = new Builing();
                    building.BuildingName = itemBuilding.Key.Building_Name;
                    building.Building = itemBuilding.Key.Building;
                    var temp = itemBuilding.Where(x => x.Building.Trim() == itemBuilding.Key.Building && x.IsSME == true && x.Line_Seq > 0).OrderBy(x=>x.Line_Seq).Select(x => new {Line_ID = x.Line_ID,Line_Name = x.Line_Name, Icon_Path = x.Icon_Path}).Distinct().ToList();
                    foreach (var itemLine in temp) {
                        Line line = new Line();
                        line.Line_ID = itemLine.Line_ID;
                        line.Line_Name = itemLine.Line_Name;
                        line.Icon_Path = itemLine.Icon_Path;
                        building.ListLine.Add(line);
                    }
                    pdc.ListBuilding.Add(building);
                }
                result.ListDept.Add(pdc);
                }
               
            }
            return result;
        }

        public async Task<object> GetDataChart(string id, int type)
        {
            PaginationParams paginationParams = new PaginationParams();
            ScoreRecordParam scoreRecordParam = new ScoreRecordParam();

            DateTime today = DateTime.Now;
            var firstDayLastOfMonth = new DateTime(today.Year, today.AddMonths(-1).Month, 1);
            if(today.Month ==1)
            {
                firstDayLastOfMonth = new DateTime(today.Year-1, today.AddMonths(-1).Month, 1);
            }
            var lastDayLastOfMonth = firstDayLastOfMonth.AddMonths(1).AddDays(-1);

            scoreRecordParam.FromDate = firstDayLastOfMonth.ToString("yyyy/MM/dd");
            scoreRecordParam.ToDate = lastDayLastOfMonth.ToString("yyyy/MM/dd");

            //Query data by Factory
            var queryLables = _iMesAuditrepo.FindAll().Where(x => x.Status == 1 && x.Line_Seq >0 );
            var queryData = await _iSMEReocrdService.GetLisSMEScoreRecord(paginationParams, scoreRecordParam, false, true);

            //GetLables chart by Factory
            var listLables = await queryLables.Where(x => x.PDC_ID != "6" && x.PDC_ID != "8" && x.PDC_ID != "C" &&
            x.PDC_ID != "D" && x.PDC_ID != "G").Select(x =>  x.PDC_ID).Distinct().ToListAsync();
            listLables.Insert(0, "Overall");
            //get name pdc
             var listLables_name = await queryLables.Where(x => x.PDC_ID != "6" && x.PDC_ID != "8" && x.PDC_ID != "C" &&
            x.PDC_ID != "D" && x.PDC_ID != "G").OrderBy(x=>x.PDC_ID).Select(x =>  x.PDC_Name).ToListAsync();
            listLables_name = listLables_name.Distinct().ToList();
            listLables_name.Insert(0, "Overall");

    
            //Get Data Chart
            var dataChart = queryData.ToList();
            // Get table weakness
            DateTime d1 = Convert.ToDateTime(scoreRecordParam.FromDate + " 00:00:00");
            DateTime d2 = Convert.ToDateTime(scoreRecordParam.ToDate + " 23:59:59");

            var auditrateM = _rateMRepository.FindAll().Where(x => (x.Audit_Type2 == "Module1" || x.Audit_Type2 == "Module3")
            && x.PDC != "6" && x.PDC != "8" && x.PDC != "C" && x.PDC != "D" && x.PDC != "G" && x.Audit_Kind == "SME" &&
            x.Record_Date >= d1 && x.Record_Date <= d2);
            var auditrateD = _rateDRepository.FindAll().Where(x => x.Rating_0 == 1);
            var AuditTypeD = _typeDRepository.FindAll();
            var Title = "";
            //HCE
            var queryJoinRateMD = auditrateM.Join(auditrateD, x => x.Record_ID, y => y.Record_ID, (x, y) => new
            {
                x.Audit_Kind,
                x.Audit_Type2,
                x.Audit_Type_ID,
                x.PDC,
                x.Building,
                x.Line,
                y.Audit_Item_ID
            });

            var dataJoin = queryJoinRateMD.GroupJoin(AuditTypeD, x => new { x.Audit_Type_ID, x.Audit_Item_ID }, z => new { z.Audit_Type_ID, z.Audit_Item_ID }, (x, z) => new
            {
                AuditRatMD = x,
                TypeD = z
            })
            .SelectMany(y => y.TypeD.DefaultIfEmpty(),
            (y, z) => new
            {
                AuditRatMD = y.AuditRatMD,
                TypeD = z
            }).ToList();

            var resultTest = dataJoin.GroupBy(x => x).Select(z => new
            {

                AudiKind = z.Key.AuditRatMD.Audit_Kind,
                Audit_Type2 = z.Key.AuditRatMD.Audit_Type2,
                PDC = z.Key.AuditRatMD.PDC,
                Building = z.Key.AuditRatMD.Building,
                Line = z.Key.AuditRatMD.Line,
                Audit_Item_ID = z.Key.AuditRatMD.Audit_Item_ID,
                Audit_Item_ZW = z.Key.TypeD.Audit_Item_ZW,
                Audit_Item_EN = z.Key.TypeD.Audit_Item_EN,
                Audit_Item_LL = z.Key.TypeD.Audit_Item_LL,
                cnt = z.Count(),
                Weakness       = "Factory" 
            }).OrderBy(z => z.Audit_Type2).ToList();
            //End HCE
            //line_seq >0
            var listLine = queryLables.Select(x=>x.Line_ID).ToList();
            resultTest = resultTest.Where(x=>listLine.Contains(x.Line)).ToList();

            //Get data chart & lables by DEPT
            if (type == 1)
            {
                var Dept_name =  queryLables.Where(x => x.PDC_ID == id).Select(x => x.PDC_Name).FirstOrDefault();
                dataChart = queryData.Where(x => x.PDC == id).ToList();
                listLables = await queryLables.Where(x => x.PDC_ID == id).Select(x => x.Building).Distinct().ToListAsync();
                //get name building
                listLables_name = await queryLables.Where(x => x.PDC_ID == id).OrderBy(x=>x.Building).Select(x => x.Building_Name).ToListAsync();
                listLables_name = listLables_name.Distinct().ToList();
                listLables.Insert(0, "Dept " + id);
                listLables_name.Insert(0, "Dept " + Dept_name);
                resultTest = resultTest.Where(x => x.PDC.Trim() == id.Trim()).ToList();
                Title ="Dept "+Dept_name;
             
            }

            //Get data chart & lables by Building
            if (type == 2)
            {
                var Building_Name = queryLables.Where(x => x.Building == id).Select(x => x.Building_Name).FirstOrDefault();
                dataChart = queryData.Where(x => x.Building == id).ToList();
                var temp =  queryLables.Where(x => x.Building == id && x.IsSME == true).Select(x => new {Line_ID = x.Line_ID, Line_Seq = x.Line_Seq} ).Distinct();
                listLables = await temp.OrderBy(x => x.Line_Seq).Select(x => x.Line_ID).ToListAsync();
                //get Name Line
                listLables_name = await queryLables.Where( x => x.Building == id && x.IsSME == true).OrderBy(x => x.Line_Seq).Select(x => x.Line_Name.Trim()).ToListAsync();
                listLables_name = listLables_name.Distinct().ToList();
                listLables.Insert(0, Building_Name);
                listLables_name.Insert(0, Building_Name);
                resultTest = resultTest.Where(x => x.Building.Trim() == id.Trim()).ToList();
                Title = id+" Building";
            }

            //Get lables Line
            if (type == 3)
            {
                var modelAuditOrg = await queryLables.Where(x => x.Line_ID == id).FirstOrDefaultAsync();
                listLables = new List<string>(){
                    "Overall",
                   "Dept "+ modelAuditOrg.PDC_ID,
                    modelAuditOrg.Building,   
                    modelAuditOrg.Line_ID
                };
                 listLables_name = new List<string>(){
                    "Overall",
                   "Dept "+ modelAuditOrg.PDC_Name,
                    modelAuditOrg.Building_Name,   
                    modelAuditOrg.Line_Name
                };
                resultTest = resultTest.Where(x => x.Line.Trim() == id.Trim()).ToList();
                Title =  modelAuditOrg.Line_Name;
            }

            //Chart
            var chartModule1 = DataChart(dataChart.Where(x => x.AuditType2 == "Module1" && listLine.Contains(x.LineId)).
            ToList(), listLables, type, id);
            var chartModule3 = DataChart(dataChart.Where(x => x.AuditType2 == "Module3" && listLine.Contains(x.LineId)).
            ToList(), listLables, type, id);
            if (type == 0)
            {
                listLables_name = listLables_name.Select(x =>
                 {
                     x = x != "Overall" ? "Dept " + x : x;
                     return x;
                 }).ToList();
                 Title ="Factory";
            }
            var month = DateTime.Now.Month - 1;
            object result = new
            {
                chartModule1,
                chartModule3,
                listLables = listLables_name,
                month,
                resultTest,
                Title

            };
            return result;
        }


        public List<decimal> DataChart(List<SMEScoreRecordDto> query, List<string> lables, int type, string id)
        {
            List<decimal> result = new List<decimal>();
            if (type != 3)
            {
                decimal totalChartFirst = 0;
                foreach (var item in lables)
                {
                    decimal totalChart = 0;
                    if (type > 0)
                    {
                        if (type == 1)
                        {
                            totalChart = query.Where(x => x.Building.Trim() == item.Trim()).ToList().Count > 0 ? query.Where(x => x.Building == item).Average(x => x.Achieving) : 0;
                            totalChartFirst = query.Where(x => x.PDC == id).ToList().Count() > 0 ? query.Where(x => x.PDC == id).ToList().Average(x => x.Achieving) : 0;
                        }

                        if (type == 2)
                        {
                            totalChart = query.Where(x => x.LineId.Trim() == item.Trim()).ToList().Count > 0 ? query.Where(x => x.LineId == item).Average(x => x.Achieving) : 0;
                            totalChartFirst = query.Where(x => x.Building == id).ToList().Count() > 0 ? query.Where(x => x.Building == id).ToList().Average(x => x.Achieving) : 0;
                        }
                    }
                    else
                    {
                        totalChart = query.Where(x => x.PDC.Trim() == item.Trim()).ToList().Count > 0 ? query.Where(x => x.PDC == item).Average(x => x.Achieving) : 0;
                        totalChartFirst = query.Count > 0 ? query.Average(x => x.Achieving) : 0;
                    }
                    result.Add(Math.Round(totalChart, 2));
                }
                result[0] = Math.Round(totalChartFirst, 2);
            }
            else
            {
                decimal factory = query.Count > 0 ? query.Average(x => x.Achieving) : 0;
                decimal pdc = query.Where(x => x.PDC == lables[1].Substring(5).Trim()).ToList().Count > 0 ? query.Where(x => x.PDC == lables[1].Substring(5).Trim()).Average(x => x.Achieving) : 0;
                decimal building = query.Where(x => x.Building == lables[2]).ToList().Count > 0 ? query.Where(x => x.Building == lables[2]).Average(x => x.Achieving) : 0;
                decimal line = query.Where(x => x.LineId == lables[3]).ToList().Count > 0 ? query.Where(x => x.LineId == lables[3]).Average(x => x.Achieving) : 0;
                result = new List<decimal>()
                {
                     Math.Round(factory,2) ,
                     Math.Round(pdc,2),
                     Math.Round(building,2),
                     Math.Round(line,2)
                };
            }

            return result;
        }

    }
}