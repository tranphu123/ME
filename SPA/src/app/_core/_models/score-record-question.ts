export class ScoreRecordQuestion {
    record_ID: string;
    audit_Type_ID: string;
    audit_Item_ID: string;
    quesion: string;
    quesionLL: string;
    quesionEN: string;
    quesionZW: string;
    rating_0: number;
    rating_1: number;
    rating_2: number;
    rate_Na: number;
    remark: string;
    typeDrating0:number;
    typeDrating1:number;
    typeDrating2:number;
    urlPicture : string;
    upload_Picture: string;
}

export class AuditRateM {
    record_ID: string;
    audit_Type_ID: string;
    pdc: string;
    pdC_Name: string;
    building: string;
    line: string;
    line_ID_2_Name: string;
    audit_Type1: string;
    audit_Type2: string;
    mE_PIC: string;
    pD_RESP: string;
    updated_By: string;
    updated_Time: string;
    record_Date: Date;
    halting_Production: boolean;
    model_Name: string;
    model_No: string;
    
}

export class AuditRateModel {
    auditRateM: AuditRateM;
    listAuditRateD: ScoreRecordQuestion[];
}
