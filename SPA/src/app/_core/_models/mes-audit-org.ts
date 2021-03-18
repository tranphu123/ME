export interface MesAuditOrg {
    factory_ID: string;
    pDC_ID: string;
    pDC_Name: string;
    line_ID: string;
    line_Name: string;
    dept_ID: string;
    dept_Name: string;
    building: string;
    building_Name: string;
    line_Seq: number;
    status: number | null;
    update_Time: string | null;
    updated_By: string;
    hP_Dept_ID: string;
    isAGV: number | null;
    block: string;
    line_ID_2: string;
    line_ID_2_Name: string;
    icon_Path: string;
    isWT: boolean;
    isSME: boolean;
    is6S: boolean;
    isWS: boolean;
} 