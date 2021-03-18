using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class AuditRateMService : IAuditRateMService
    {
        private readonly IAuditRateMRepository _auditRateMRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public AuditRateMService(IAuditRateMRepository auditRateMRepository,
                                 IMapper mapper,
                                 MapperConfiguration configMapper)
        {
            _auditRateMRepository = auditRateMRepository;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<bool> Add(AuditRateMDto model)
        {
            var auditRateM = _mapper.Map<MES_Audit_Rate_M>(model);
            _auditRateMRepository.Add(auditRateM);
            return await _auditRateMRepository.SaveAll();
        }
    }
}