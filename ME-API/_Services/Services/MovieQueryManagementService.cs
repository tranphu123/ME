using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using Microsoft.EntityFrameworkCore;
using ME_API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ME_API._Services.Services
{
    public class MovieQueryManagementService : IMovieQueryManagementService
    {
        private readonly IAuditTypeRepository _repoAuditMType;
        private readonly IAuditTypeDRepository _repoAuditDType;
        private readonly MapperConfiguration _configMapper;

        public MovieQueryManagementService(IAuditTypeRepository repoAuditMType,
                                            IAuditTypeDRepository repoAuditDType,
                                             MapperConfiguration configMapper)
        {
            _configMapper = configMapper;
            _repoAuditDType = repoAuditDType;
            _repoAuditMType = repoAuditMType;
        }
        public async Task<List<int>> GetVersion(string audittypeID)
        {
            var brand = _repoAuditMType.FindAll().Where(x => x.Audit_Type_ID == audittypeID).FirstOrDefault();
            var data = await _repoAuditMType.FindAll().Where(x => x.Brand == brand.Brand
            && x.Audit_Type1 == brand.Audit_Type1 && x.Audit_Type2 == brand.Audit_Type2).
            GroupBy(x => x.Version).Select(y => y.Key).ToListAsync();
            return data;
        }

        public async Task<object> GetAuditItem(string audittypeID)
        {
            var data = await _repoAuditDType.FindAll(x => x.Audit_Type_ID.Trim() == audittypeID).
            GroupBy(x => x.Audit_Item_ID).Select(y =>new{Audit_Item_ID =y.Key}).ToListAsync();
            var result = (from a in data
            select new {
                Audit_Item_ID = a.Audit_Item_ID,
                oderby =(a.Audit_Item_ID.Split(".")).Count()==1?0:a.Audit_Item_ID.Split(".")[1].ToInt()
            });
            result = result.OrderBy(x=>x.Audit_Item_ID.Split(".")[0].ToInt()).ThenBy(x=>x.oderby);
            return result;
        }
        public async Task<object> GetAllAudittype(string brand)
        {
            var result = await _repoAuditMType.FindAll(x => x.Brand.Trim() == brand).ToListAsync();
            var data = from a in result
                       select new
                       {
                           audit_Type_ID = result.Where(y => y.Audit_Kind == a.Audit_Kind && y.Audit_Type1 == a.Audit_Type1
                            && y.Audit_Type2 == a.Audit_Type2 &&
                            y.Version == result.Where(x => x.Audit_Kind == a.Audit_Kind && x.Audit_Type1 == a.Audit_Type1
                            && x.Audit_Type2 == a.Audit_Type2).OrderByDescending(x => x.Version).FirstOrDefault().Version)
                       .OrderByDescending(x => x.Audit_Type_ID).FirstOrDefault().Audit_Type_ID,
                           Audit_Kind = a.Audit_Kind==null?"":a.Audit_Kind,
                           Audit_Type1 = a.Audit_Type1==null?"":a.Audit_Type1,
                           Audit_Type2 = a.Audit_Type2 ==null?"":a.Audit_Type2,
                       };
            return data.Distinct();
        }
        public async Task<PagedList<AuditType_D_Dto>> SeachMoviequerylist(PaginationParams param,MovieQueryDto movieQueryDto)
        {
                var data = await _repoAuditDType.FindAll().ProjectTo<AuditType_D_Dto>(_configMapper)
                .Where(x => x.Audit_Type_ID.Trim() == movieQueryDto.Audit_Type_ID.Trim()).ToListAsync();
            if (movieQueryDto.Latest == true)
            {
                 if (movieQueryDto.Audititem != "")
                {
                    data = data.Where(x => x.Audit_Item_ID.Trim() == movieQueryDto.Audititem.Trim()).ToList();
                }
                if (movieQueryDto.Text != "")
                {
                    data = data.Where(x => (x.Audit_Item_LL!=null &&x.Audit_Item_LL.Contains(movieQueryDto.Text)) ||
                           (x.Audit_Item_EN!=null && x.Audit_Item_EN.Contains(movieQueryDto.Text)) ||
                            (x.Audit_Item_ZW !=null && x.Audit_Item_ZW.Contains(movieQueryDto.Text))).ToList();
                }
               var AuditTypeD = data.Select(x=>{
                   x.orderby =(x.Audit_Item_ID.Split(".")).Count()==1?0:x.Audit_Item_ID.Split(".")[1].ToInt();
                    return x;
                }).ToList();
                AuditTypeD =AuditTypeD.OrderBy(x=>x.Audit_Item_ID.Split(".")[0].ToInt()).ThenBy(x=>x.orderby).ToList();
                 return  PagedList<AuditType_D_Dto>.Create(AuditTypeD, param.PageNumber, param.PageSize);
            }
          List<AuditType_D_Dto> result = new List<AuditType_D_Dto>();
            if(movieQueryDto.Audit_Type_ID !="")
            {
                   //lấy Audit_Type_ID sau khi so đk
            var typeM = await _repoAuditMType.FindAll(x=>x.Audit_Type_ID ==movieQueryDto.Audit_Type_ID).FirstOrDefaultAsync();
            var Audit_Type_ID_model = await _repoAuditMType.FindAll().Where(x=>x.Brand ==typeM.Brand &&x.Audit_Type1 
            == typeM.Audit_Type1 && x.Audit_Type2 ==typeM.Audit_Type2 && x.Version ==movieQueryDto.Version.ToInt()).
            OrderByDescending(x=>x.Audit_Type_ID).FirstOrDefaultAsync();
            var Audit_Type_ID = Audit_Type_ID_model.Audit_Type_ID;
            result = await _repoAuditDType.FindAll(x=>x.Audit_Type_ID==Audit_Type_ID).ProjectTo<AuditType_D_Dto>(_configMapper).ToListAsync();
            
                if (movieQueryDto.Audititem != "")
                {
                    result = result.Where(x => x.Audit_Item_ID.Trim() == movieQueryDto.Audititem.Trim()).ToList();
                }
                if (movieQueryDto.Text != "")
                {
                    result = result.Where(x => x.Audit_Item_LL.Contains(movieQueryDto.Text) ||
                            x.Audit_Item_EN.Contains(movieQueryDto.Text) ||
                            x.Audit_Item_ZW.Contains(movieQueryDto.Text)).ToList();
                }
             var AuditType = result.Select(x=>{
                   x.orderby =(x.Audit_Item_ID.Split(".")).Count()==1?0:x.Audit_Item_ID.Split(".")[1].ToInt();
                    return x;
                }).ToList();
                AuditType =AuditType.OrderBy(x=>x.Audit_Item_ID.Split(".")[0].ToInt()).ThenBy(x=>x.orderby).ToList();
             return  PagedList<AuditType_D_Dto>.Create(AuditType, param.PageNumber, param.PageSize);
            }
            else
            {
                
                 return  PagedList<AuditType_D_Dto>.Create(result, param.PageNumber, param.PageSize);
            }
        }
    }
}