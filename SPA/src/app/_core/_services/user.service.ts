import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../src/environments/environment";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs";
import { PaginatedResult } from "../_models/pagination";
import { User } from "../_models/user";
import { map } from "rxjs/internal/operators/map";
import { AuditRoleUser } from '../_models/audit-role-user';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token")
  })
};
@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMesUser(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    return this.http
      .get<User[]>(this.baseUrl + "MesUser", { observe: "response", params })
      .pipe(
        map(response => {
          console.log(response);
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

  search(page?, itemsPerPage?, text?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    return this.http
      .get<User[]>(this.baseUrl + "MesUser/search/" + text, {
        observe: "response",
        params
      })
      .pipe(
        map(response => {
          console.log(response);
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
  GetRoleByUser(user: string) {
    return this.http.get<any[]>(this.baseUrl + 'MesUser/roleUser/'+user);
  }
  SaveRoleUser(item:any){
    return this.http.post(this.baseUrl + 'MesUser/saverole', item);
  }
}
