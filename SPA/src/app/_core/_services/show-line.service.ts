import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MesAuditOrg} from '../_models/mes-audit-org';
import { PaginatedResult } from '../_models/pagination';
import { ShowLineSearch } from '../_models/show-line-search';

@Injectable({
  providedIn: 'root'
})
export class ShowLineService {
  pdc: string;
  building: string;
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }



  getListAll(
    page?,
    itemsPerPage?,
    showLineSearch?: ShowLineSearch
  ): Observable<PaginatedResult<MesAuditOrg[]>> {
    const paginatedResult: PaginatedResult<MesAuditOrg[]> = new PaginatedResult<
    MesAuditOrg[]
    >();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    let url = this.baseUrl + "MesOrg/show-line";
   
    return this.http
      .post<any>(url, showLineSearch, { observe: "response", params })
      .pipe(
        map(response => {
          console.log("serpr", response )
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }

  changeLine(item: any){
    return this.http.post(this.baseUrl + 'MesOrg/changeLine', item);
  }

}
