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
    public class SMEReportService : ISMEReportService
    {
         private readonly IAuditRateDRepository _auditRateDRepository;
        private readonly IAuditRateMRepository _auditRateMRepository;
        private readonly IAuditTypeDRepository _auditTypeDRepository;

        private readonly IAuditTypeRepository _auditTypeMRepository;
        private readonly MapperConfiguration _configMapper;
        private readonly IMesAuditOrgRepository _mesAuditOrg;

        public SMEReportService(IAuditRateDRepository auditRateDRepository, IAuditTypeRepository auditTypeMRepository, IAuditTypeDRepository auditTypeDRepository,
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

        public async Task<List<string>> GetAuditType1BySME()
        {
            //SME là giá trị fix cứng
            var auditType1 = await _auditTypeMRepository.FindAll(x => x.Audit_Kind.Trim() == "SME").Select(x => x.Audit_Type1).Distinct().ToListAsync();
            return auditType1;
        }


        public async Task<PagedList<SMEScoreRecordDto>> GetLisSMEScoreRecord(PaginationParams paginationParams, ScoreRecordParam scoreRecordParam, bool isPaging = true)
        {
            // SME là giá trị fix cứng
            var paramAuditTypeIdBySME = await _auditTypeMRepository.FindAll(x => x.Audit_Kind == "SME").Select(x => x.Audit_Type_ID).ToListAsync();

            var queryAuditRateM = _auditRateMRepository.FindAll().Where(x => paramAuditTypeIdBySME.Contains(x.Audit_Type_ID));
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

            var data = queryAuditRateM.Join(listAuditMes, x => x.Line, t => t.Line_ID_2, (x, t) => new SMEScoreRecordDto
            {
                RecordId = x.Record_ID,
                AuditDate = x.Record_Date,
                AuditType = x.Audit_Type1,
                AuditType2 = x.Audit_Type2,
                LineId = x.Line,
                Line_Name = t.Line_ID_2_Name,
                UpdateBy = x.Updated_By,
                UpdateTime = x.Updated_Time,
                Rating0 = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID).Sum(z => z.Rating_0),
                Rating1 = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID).Sum(z => z.Rating_1),
                Rating2 = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID).Sum(z => z.Rating_2),
                RatingNa = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID).Sum(z => z.Rate_NA) == null ? 0 : queryAuditRateD.Where(y => y.Record_ID == x.Record_ID).Sum(z => z.Rate_NA),
                CheckAnswerAllYet = queryAuditRateD.Where(y => y.Record_ID == x.Record_ID && y.Rate_NA == 0 && y.Rating_0 == 0 && y.Rating_1 == 0 && y.Rating_2 == 0).Count() > 0 ? false : true
            }).Distinct().OrderByDescending(x=>x.UpdateTime);
            return await PagedList<SMEScoreRecordDto>.CreateAsync(data, paginationParams.PageNumber, paginationParams.PageSize, isPaging);
        }

    }
}