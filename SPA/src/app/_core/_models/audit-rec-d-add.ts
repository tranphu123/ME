export interface AuditRecDAdd {
    id: number;
    record_ID: string;
    item_no: string;
    ercs: string;
    audit_Type_ID: string;
    audit_Item: string;
    issue_ZW: string;
    issue_LL: string;
    issue_EN: string;
    before_Picture: string;
    after_Picture: string;
    pD_PIC: string;
    pD_RESP: string;
    mE_PIC: string;
    finished_Date: string;
    status: string;
    remark: string;
    updated_By: string;
    updated_Time: Date;
    implement_User: string;
    implement_Time: Date;
}
