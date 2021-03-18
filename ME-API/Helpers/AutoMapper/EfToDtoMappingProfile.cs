using ME_API.DTO;
using ME_API.Models;
using AutoMapper;

namespace ME_API.Helpers.AutoMapper
{
    public class EfToDtoMappingProfile : Profile
    {
        public EfToDtoMappingProfile()
        {
            CreateMap<MES_User, UserForDetailDto>();
            CreateMap<MES_Audit_Brand, BrandDto>();
            CreateMap<MES_Audit_Type_M, AuditTypeDto>();
            CreateMap<MES_Audit_Type_D, AuditType_D_Dto>();
            CreateMap<MES_Audit_PIC_M, AuditPicMDto>();
            CreateMap<MES_Audit_PIC_D, AuditPicDDto>();
            CreateMap<MES_Audit_Rec_M, AuditRecMDto>();
            CreateMap<MES_Audit_Rec_D, AuditRecDDto>();
            CreateMap<MES_Org, MesOrgDto>();
            CreateMap<MES_MO, MesMoDto>();
            CreateMap<MES_Audit_Rate_M, AuditRateMDto>();
            CreateMap<MES_Audit_Roles,AuditRolesDto>();
            CreateMap<MES_Audit_RoleUser,AuditRoleUserDto>();
        }
        
    }
}