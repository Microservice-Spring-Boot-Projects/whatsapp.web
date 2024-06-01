import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {AccountProperty} from "./pojos";

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  httpOptions = {
    headers: new HttpHeaders({
        "Authorization": ("Basic " + btoa("celle2006:Linti21!")),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      }
    )
  }

  constructor(private http: HttpClient) {
  }

  getuser(username: string): Observable<any> {
    return this.http.get(environment.USER_URL + "/" + username, this.httpOptions);
  }

  getTemplates(accountIdentifier: string): Observable<any> {
    return this.http.get(environment.ACCOUNT_USER_URL + "/templates?identifier=" + accountIdentifier);
  }

  getAccountData(accountIdentifier: string): Observable<any> {
    return this.http.get(environment.ACCOUNT_USER_URL + "/read?identifier=" + accountIdentifier + "&type=whatsapp");
  }

  getStandards(accountIdentifier: string): Observable<any> {
    return this.http.get(environment.ACCOUNT_USER_URL + "/standards?identifier=" + accountIdentifier);
  }

  updateAccountProperty(property: AccountProperty): Observable<any>{
    return this.http.patch(environment.ACCOUNT_USER_URL + "/updateProperty", property);
  }
}
