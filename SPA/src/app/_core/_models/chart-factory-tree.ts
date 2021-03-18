  
  export interface Factory {
    factory: string;
    listDept: PDC[];
  }
  
  export interface PDC {
    pdcName: string;
    pdC_ID:string;
    listBuilding: Building[];
  }
  
  export interface Building {
    building :string;
    buildingName: string;
    listLine: Line[];
  }
  export interface Line {
    line_ID :string;
    line_Name: string;
    icon_Path: string;
  }
  