import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MesOrgService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getAllPdc() {
    return this.http.get<any>(this.baseUrl + 'mesOrg/allPdc', {});
  }
  getAllBuilding(pdc:string) {
    return this.http.get<any>(this.baseUrl + 'mesOrg/allBuilding', {params : {
      pdc: pdc}});
  }
  getAllLineId(pdc:string,building:string) {
    return this.http.get<any>(this.baseUrl + 'mesOrg/allLineID', {params : {
      pdc: pdc,
      building:building}});
  }

  getAllLineIdAuditOrg(pdc:string, building:string, isline: string) {
    return this.http.get<any>(this.baseUrl + 'mesOrg/allLineIDAuditIsLine', {params : {
      pdc: pdc,
      building:building,
      isline: isline}});
  } 


}
