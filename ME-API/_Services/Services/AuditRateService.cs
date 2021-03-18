using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ME_API._Repositories.Interface;
using ME_API._Services.Interface;
using ME_API.DTO;
using ME_API.Helpers;
using ME_API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace ME_API._Services.Services
{
    public class AuditRateService : IAuditRateService
    {

        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IAuditRateDRepository _auditRateDRepository;
        private readonly IAuditRateMRepository _auditRateMRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMesAuditOrgRepository _mesAuditOrgRepository;
        private readonly IMesUserRepository _mesUserRepository;
        private readonly IAuditTypeRepository _auditTypeMRepository;
        private readonly IAuditTypeDRepository _auditTypeDRepository;
        private readonly IAuditPicDRepository _auditPicDRepository;

        public AuditRateService(IMapper mapper, MapperConfiguration configMapper,
            IAuditRateDRepository auditRateDRepository,
            IAuditRateMRepository auditRateMRepository,
            IWebHostEnvironment webHostEnvironment,
            IAuditTypeRepository auditTypeMRepository,
            IAuditTypeDRepository auditTypeDRepository,
            IAuditPicDRepository auditPicDRepository,
            IMesAuditOrgRepository mesAuditOrgRepository,
            IMesUserRepository mesUserRepository)
        {
            _mapper = mapper;
            _configMapper = configMapper;
            _webHostEnvironment = webHostEnvironment;
            _auditRateDRepository = auditRateDRepository;
            _auditRateMRepository = auditRateMRepository;
            _auditTypeMRepository = auditTypeMRepository;
            _auditTypeDRepository = auditTypeDRepository;
            _auditPicDRepository = auditPicDRepository;
            _mesAuditOrgRepository = mesAuditOrgRepository;
            _mesUserRepository = mesUserRepository;
        }

        public async Task<List<ScoreRecordQuesDto>> GetListQuesScoreRecord(string auditTypeId)
        {
            MES_Audit_Type_M auditType;
            auditType = _auditTypeMRepository.FindAll().Where(x => x.Audit_Type_ID.Trim() == auditTypeId.Trim()).FirstOrDefault();

            List<ScoreRecordQuesDto> data = new List<ScoreRecordQuesDto>();

            if (auditType != null)
            {

                var queryAudiiTypeD = _auditTypeDRepository.FindAll().Where(x => x.Audit_Type_ID.Trim() == auditType.Audit_Type_ID.Trim() && x.Visible == true);
                data = await queryAudiiTypeD.Select(x => new ScoreRecordQuesDto
                {
                    Audit_Type_ID = x.Audit_Type_ID,
                    Audit_Item_ID = x.Audit_Item_ID,
                    Quesion = x.Audit_Item_LL,
                    QuesionLL = x.Audit_Item_LL,
                    QuesionEN = x.Audit_Item_EN,
                    QuesionZW = x.Audit_Item_ZW,
                    TypeDrating0 = x.Rating_0,
                    TypeDrating1 = x.Rating_1,
                    TypeDrating2 = x.Rating_2,
                    orderby = 0
                }).OrderBy(x => x.Audit_Item_ID).ToListAsync();
                 data =   data.Select(x=>{
                            x.orderby = (x.Audit_Item_ID.Split(".")).Count()==1?0:x.Audit_Item_ID.Split(".")[1].ToInt();
                            return x;
                        }).ToList();
                     data = data.OrderBy(x => x.Audit_Item_ID.Split(".")[0].ToInt())
                     .ThenBy(x=>x.orderby).ToList();
                // data = data.OrderBy(x => x.Audit_Item_ID.Split(".")[0].ToInt())
                // .ThenBy(x => x.Audit_Item_ID.Split(".")[1].ToInt()).ToList();
            }
            return data;

        }
        //Get record ID 
        public async Task<string> GetRecordIdRate()
        {
            string record_Id = "RA" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString());
            var item = await _auditRateMRepository.FindAll(x => x.Record_ID.Contains(record_Id)).OrderByDescending(x => x.Record_ID).FirstOrDefaultAsync();
            if (item != null)
            {
                var serinumber = item.Record_ID.Substring(7).ToInt();
                var tmp = (serinumber >= 999) ? (serinumber + 1).ToString() : (serinumber >= 99) ? ("0" + (serinumber + 1)) : (serinumber < 9) ? ("000" + (serinumber + 1)) : ("00" + (serinumber + 1));
                record_Id = "RA" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString()) + tmp;
            }
            else
            {
                record_Id = "RA" + DateTime.Now.Year.ToString().Substring(2) + (DateTime.Now.Month < 10 ? ("0" + DateTime.Now.Month) : DateTime.Now.Month.ToString()) + "0001";
            }
            return record_Id;
        }

        public async Task<ScoreRecordDetailDto> GetScoreRecordDetail(string recordId)
        {

            var auditRateMModel = _auditRateMRepository.FindSingle(x => x.Record_ID.Trim() == recordId);         
            ScoreRecordDetailDto result = new ScoreRecordDetailDto();

            if (auditRateMModel != null)
            {
                var listAuditRateDModel = _auditRateDRepository.FindAll(x => x.Record_ID == auditRateMModel.Record_ID);
                var listAuditTypeD = _auditTypeDRepository.FindAll(x => x.Audit_Type_ID == auditRateMModel.Audit_Type_ID);
                var listAuditRateD = await (from a in listAuditRateDModel
                                     join b in listAuditTypeD 
                                     on a.Audit_Item_ID equals b.Audit_Item_ID
                                     select new AuditRateDDetailDto
                {
                    RecordId = a.Record_ID,
                    AuditItemId = a.Audit_Item_ID,
                    Rating0 = a.Rating_0,
                    Rating1 = a.Rating_1,
                    Rating2 = a.Rating_2,
                    RatingNA = a.Rate_NA,
                    Remark = a.Remark,
                    UplloadPicture = a.Upload_Picture,
                    AuditItemLL = _auditTypeDRepository.GetAuditItemLL(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    AuditItemEN = _auditTypeDRepository.GetAuditItemEN(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    AuditItemZW = _auditTypeDRepository.GetAuditItemZW(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    TypeDrating0 = _auditTypeDRepository.GetTypeDrating0(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    TypeDrating1 = _auditTypeDRepository.GetTypeDrating1(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    TypeDrating2 = _auditTypeDRepository.GetTypeDrating2(auditRateMModel.Audit_Type_ID, a.Audit_Item_ID),
                    oderby =0,
                    RatingDetail =a.Rating_0 ==1?b.Rating_0.ToString():a.Rating_1 ==1?b.Rating_1.ToString():"NA",
                    //  RatingDetail =b.Rating_1
                }).ToListAsync();
                     listAuditRateD =   listAuditRateD.Select(x=>{
                            x.oderby = (x.AuditItemId.Split(".")).Count()==1?0:x.AuditItemId.Split(".")[1].ToInt();
                            return x;
                        }).ToList();
                     listAuditRateD = listAuditRateD.OrderBy(x => x.AuditItemId.Split(".")[0].ToInt())
                     .ThenBy(x=>x.oderby).ToList();
                     
                var dataRateMmodel = _mapper.Map<AuditRateMDto>(auditRateMModel);
              
                var dataUser = _mesUserRepository.FindAll().Where(x => x.User_ID.Trim() == dataRateMmodel.Updated_By.Trim()).Select( x => new {
                    user = x.User_ID+"_"+x.User_Name
                }).FirstOrDefault();
                dataRateMmodel.Line_ID_2_Name = _mesAuditOrgRepository.FindAll().Where( x=> x.Line_ID_2.Trim() == dataRateMmodel.Line.Trim()).FirstOrDefault().Line_ID_2_Name;
                dataRateMmodel.PDC_Name = _mesAuditOrgRepository.FindAll().Where(x => x.PDC_ID.Trim() == dataRateMmodel.PDC.Trim()).FirstOrDefault().PDC_Name;
                dataRateMmodel.Updated_By = dataUser ==null?dataRateMmodel.Updated_By:dataUser.user;
                result.auditRateM = dataRateMmodel;
                result.listAuditRateD = listAuditRateD;
            }
            return result;
        }

        public async Task<bool> SaveScopeRecord(ScoreRecordAnsDto param)
        {
            string record_Id = await GetRecordIdRate();
            var auditTypeM = _auditTypeMRepository.FindSingle(x => x.Audit_Type_ID.Trim() == param.auditRateM.Audit_Type_ID.Trim());
            
            DateTime timeNow = DateTime.Now;
            param.auditRateM.Record_ID = record_Id;
            param.auditRateM.Updated_Time = timeNow;
            param.auditRateM.Audit_Type1 = auditTypeM.Audit_Type1;
            param.auditRateM.Audit_Type2 = auditTypeM.Audit_Type2;
            param.auditRateM.Audit_Kind = auditTypeM.Audit_Kind;

            
             //Set value record and updateBy  all object in list  
            var listAuditRateDModel = param.listAuditRateD.Select(x =>
            {
                x.Record_ID = record_Id;
                string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
                if(x.Upload_Picture != null)
                {
                    var source = x.Upload_Picture;
                    string base64 = source.Substring(source.IndexOf(',') + 1);
                    base64 = base64.Trim('\0');
                    byte[] chartData = Convert.FromBase64String(base64);
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    var fileName = x.Record_ID + "_" + x.Audit_Item_ID +".jpg";
                    string filePathB4 = Path.Combine(folder, fileName);
                    System.IO.File.WriteAllBytes(filePathB4, chartData);
                    x.Upload_Picture = fileName;
                }
                x.Updated_By = param.auditRateM.Updated_By;
                x.Updated_Time = timeNow;
                return x;
            }).ToList();

            
            //Mapper
            var listAuditRateD = _mapper.Map<List<AuditRateDDto>, List<MES_Audit_Rate_D>>(listAuditRateDModel);
            var auditRateM = _mapper.Map<MES_Audit_Rate_M>(param.auditRateM);

            //Add DB
            _auditRateMRepository.Add(auditRateM);
            _auditRateDRepository.AddMultiple(listAuditRateD);

            try
            {
                //Save
                return await _auditRateDRepository.SaveAll();

            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<object> GetLanguage(string user)
        {
            var ressult = await _auditPicDRepository.FindAll(x => x.Resp_ID.Trim() == user.Trim()).Select(x => new
            {
                x.Language
            }).ToListAsync();
            return ressult;
        }

        public async Task<bool> UpdateListScopeRecordDetail(List<AuditRateDDto> listModel, string updateBy)
        {
            var dataModel = await _auditRateDRepository.FindAll().Where(x => x.Record_ID.Trim() == listModel[0].Record_ID.Trim()).ToListAsync();
            DateTime timeNow = DateTime.Now;
            if (dataModel[0] != null)
            {
                List<MES_Audit_Rate_D> listData = new List<MES_Audit_Rate_D>();
                foreach (var item in listModel)
                {
                    var data = dataModel.Where(x => x.Audit_Item_ID.Trim() == item.Audit_Item_ID.Trim()).FirstOrDefault();
                    data.Updated_By = updateBy;
                    data.Updated_Time = timeNow;
                    data.Rating_0 = item.Rating_0;
                    data.Rating_1 = item.Rating_1;
                    data.Rating_2 = item.Rating_2;
                    data.Rate_NA = item.Rate_NA;
                    data.Remark = item.Remark;
                    data.Upload_Picture = item.Upload_Picture;
                    listData.Add(data);
                }
                _auditRateDRepository.UpdateMultiple(listData);
                return await _auditRateDRepository.SaveAll();
            }
            else
                return false;
        }


    }
}