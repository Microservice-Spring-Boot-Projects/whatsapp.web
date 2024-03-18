import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {Message} from "./pojos";

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

  findMessages(accountIdenifier: string, participantId: number): Observable<any>  {
    return this.http.get(environment.MESSAGE_URL + "?accountIdentifier=" + accountIdenifier
      + "&participantId=" + participantId
      , this.httpOptions);
  }

  postMessage(message: Message, accountId: number): Observable<any> {
    return this.http.post(environment.MESSAGE_URL, message, this.httpOptions);
  }

}
