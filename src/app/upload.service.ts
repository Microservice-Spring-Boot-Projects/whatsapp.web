import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TemplateRequest } from './pojos';
import { Filter } from './admin/news/broadcast/filter';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
        "Authorization": ("Basic " + btoa("celle2006:Linti21!")),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      }
    )
  }

  upload(file: File, templateRequest:TemplateRequest): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("templateRequest", JSON.stringify(templateRequest));
    return this.http.post(environment.MESSAGE_URL + "/uploadTemplate", formData, this.httpOptions);
  }
}
