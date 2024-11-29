import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Participant, SalesOrder } from './pojos';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  httpOptions = {
    headers: new HttpHeaders({
        "Authorization": ("Basic " + btoa("celle2006:Linti21!")),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      }
    )
  }

  constructor(private http: HttpClient) { }

  searchParticipant(companyId: string, searchTxt: string): Observable<any> {
    return this.http.get(environment.SALES_URL + "/participants?companyId=" + companyId + "&searchTxt=" + searchTxt, this.httpOptions);
  }

  saveParticipant(participant: Participant): Observable<any> {
    return this.http.put(environment.SALES_URL + "/participant", participant, this.httpOptions);
  }

  saveSalesOrder(salesOrder: SalesOrder) :Observable<any>{
    return this.http.post(environment.SALES_URL, salesOrder, this.httpOptions);
  }

}