using System.Collections.Generic;
using System.Threading.Tasks;
using ME_API.DTO;
using ME_API.Helpers;

namespace ME_API._Services.Interface {
    public interface IAuditRateService {

        Task<List<ScoreRecordQuesDto>> GetListQuesScoreRecord (string auditTypeId);
        Task<bool> SaveScopeRecord (ScoreRecordAnsDto param);
        Task<string> GetRecordIdRate ();
        Task<ScoreRecordDetailDto> GetScoreRecordDetail (string recordId);
        Task<object> GetLanguage(string user);
        
        Task<bool> UpdateListScopeRecordDetail(List<AuditRateDDto> listModel ,string updateBy);
    }
}