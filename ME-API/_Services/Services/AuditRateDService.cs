using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;

namespace ME_API._Services.Services
{
    public class AuditRateDService : IAuditRateDService
    {
        private readonly IAuditRateDRepository _auditRateDRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public AuditRateDService(IAuditRateDRepository auditRateDRepository,
                                 IMapper mapper,
                                 MapperConfiguration configMapper)
        {
            _auditRateDRepository = auditRateDRepository;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<bool> Add(AuditRateDDto model)
        {
            var auditRateD = _mapper.Map<MES_Audit_Rate_D>(model);
            _auditRateDRepository.Add(auditRateD);
            return await _auditRateDRepository.SaveAll();
        }
        public async Task<bool> UpdateUploadPicture(string recordId, string auditItemId, string uploadPicture)
        {
            var auditRateD = _auditRateDRepository.FindSingle(x => x.Record_ID == recordId && x.Audit_Item_ID == auditItemId);
            if (auditRateD != null)
            {
                auditRateD.Upload_Picture = uploadPicture;
                _auditRateDRepository.Update(auditRateD);

                return await _auditRateDRepository.SaveAll();
            }
            else 
            {
                return false;
            }
        }
    }
}