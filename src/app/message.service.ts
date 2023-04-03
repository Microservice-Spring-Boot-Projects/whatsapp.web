import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

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

  findParticipants(accountIdenifier: string): Observable<any> {
    return this.http.get(environment.MESSAGE_URL + "/listParticipants?accountIdentifier=" + accountIdenifier, this.httpOptions);
  }


}
