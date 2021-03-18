import { AuditRateM } from './score-record-question';

export interface ScoreRecordDetail {
    auditRateM: AuditRateM;
    listAuditRateD: AuditRateDDetail[];
}

export interface AuditRateDDetail {
    recorId: string;
    auditItemId: string;
    auditItemLL: string;
    auditItemZW: string;
    auditItemEN: string;
    rating0: number;
    rating1: number;
    rating2: number;
    ratingNA: number;
    typeDrating0:number;
    typeDrating1:number;
    typeDrating2:number;
    remark: string;
    uplloadPicture: string;
    ratingDetail: string;
}
