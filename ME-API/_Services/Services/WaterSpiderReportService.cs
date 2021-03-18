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
using Microsoft.EntityFrameworkCore;
namespace ME_API._Services.Services
{
    public class WaterSpiderReportService : IWaterSpiderReportService
    {
          private readonly IAuditRateDRepository _auditRateDRepository;
        private readonly IAuditRateMRepository _auditRateMRepository;
        private readonly IAuditTypeDRepository _auditTypeDRepository;

        private readonly IAuditTypeRepository _auditTypeMRepository;
        private readonly MapperConfiguration _configMapper;
        private readonly IMesAuditOrgRepository _mesAuditOrg;

        public WaterSpiderReportService(IAuditRateDRepository auditRateDRepository, IAuditTypeRepository auditTypeMRepository, IAuditTypeDRepository auditTypeDRepository,
            IAuditRateMRepository auditRateMRepository,
             IMesAuditOrgRepository mesAuditOrg, MapperConfiguration configMapper)
        {
            _mesAuditOrg = mesAuditOrg;
            _configMapper = configMapper;
            _auditRateDRepository = auditRateDRepository;
            _auditRateMRepository = auditRateMRepository;
            _auditTypeDRepository = auditTypeDRepository;
            _auditTypeMRepository = auditTypeMRepository;
        }
        public async Task<PagedList<WaterSpiderScoreRecordDto>> GetLisWaterSpiderScoreRecord(PaginationParams paginationParams, ScoreRecordParam scoreRecordParam, bool isPaging = true)
        {
            // WS là giá trị fix cứng
            var paramAuditTypeIdByWaterSpider = await _auditTypeMRepository.FindAll(x => x.Audit_Kind.Trim() == "WS").Select(x => x.Audit_Type_ID).ToListAsync();

            var queryAuditRateM = _auditRateMRepository.FindAll().Where(x => paramAuditTypeIdByWaterSpider.Contains(x.Audit_Type_ID));
            var queryAuditRateD = _auditRateDRepository.FindAll();
             var listAuditMes = _mesAuditOrg.FindAll(x=>x.Status ==1);
            if (scoreRecordParam.PDC != "")
            {
                queryAuditRateM = queryAuditRateM.Where(x => x.PDC.Trim() == scoreRecordParam.PDC);
            }
            if (scoreRecordParam.Building != "")
            {
                queryAuditRateM = queryAuditRateM.Where(x => x.Building.Trim() == scoreRecordParam.Building);
            }
            if (scoreRecordParam.Line != "")
            {
                queryAuditRateM = queryAuditRateM.Where(x => x.Line.Trim() == scoreRecordParam.Line);
            }
            if (scoreRecordParam.AuditType1 != "")
            {
                queryAuditRateM = queryAuditRateM.Where(x => x.Audit_Type1.Trim() == scoreRecordParam.AuditType1);
            }
            if (scoreRecordParam.AuditType2 != "")
            {
                queryAuditRateM = queryAuditRateM.Where(x => x.Audit_Type2.Trim() == scoreRecordParam.AuditType2);
            }
            if (scoreRecordParam.FromDate != "" && scoreRecordParam.ToDate != "")
            {
                DateTime d1 = Convert.ToDateTime(scoreRecordParam.FromDate + " 00:00:00");
                DateTime d2 = Convert.ToDateTime(scoreRecordParam.ToDate + " 23:59:59");
                queryAuditRateM = queryAuditRateM.Where(x => x.Record_Date >= d1 && x.Record_Date <= d2);
            }

            var data = queryAuditRateM.Join(listAuditMes, x => x.Line, t => t.Line_ID_2, (x, t) =>
             new WaterSpiderScoreRecordDto
            {
                RecordId = x.Record_ID,
                AuditType = x.Audit_Type1,
                AuditDate = x.Record_Date,
                LineId = x.Line,
                Line_Name =t.Line_ID_2_Name,
                Score = _auditRateDRepository.SumEachRating1InAuditTypeDAndAuditRateD(x.Record_ID),
                Loss = _auditRateDRepository.SumEachRating0InAuditTypeDAndAuditRateD(x.Record_ID),
                NA = _auditRateDRepository.SumEachRatingNAInAuditTypeDAndAuditRateD(x.Record_ID),
                CheckAnswerAllYet = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID && y.Rate_NA == 0 && y.Rating_0 == 0 && y.Rating_1 == 0 && y.Rating_2 == 0).Count() > 0 ? false : true
            });
             var result =data.Distinct().ToList();
            result = result.OrderByDescending(x=>x.AuditDate).ToList();
            return  PagedList<WaterSpiderScoreRecordDto>.Create(result, paginationParams.PageNumber, paginationParams.PageSize, isPaging);
        }
            public async Task<List<string>> GetAuditType1ByWaterSpider()
        {
            //WS là giá trị fix cứng
            var auditType1 = await _auditTypeMRepository.FindAll(x => x.Audit_Kind.Trim() == "WS").Select(x => x.Audit_Type1).Distinct().ToListAsync();
            return auditType1;
        }
    }
}