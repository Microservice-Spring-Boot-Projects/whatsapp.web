import {Component, Input, OnInit} from '@angular/core';
import {ReportService} from "../../report.service";
import {Company, Participant} from "../../pojos";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'optin-user',
  templateUrl: './optin-user.component.html',
  styleUrl: './optin-user.component.css'
})
export class OptinUserComponent implements OnInit
{

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportOptInUsers();
  }

  @Input() company: Company;

  participants: Participant[];
  dataSource: any;
  displayedColumns: string[] = ['participantName', 'participantMobile', 'registrationDate'];

  reportOptInUsers() :void{
    this.reportService.reportOptinUsers("" + this.company.id, "brochure").subscribe({
      next: (v) => {
        this.participants = v;
        if(!environment.production)
          console.log(v);
        this.dataSource = this.participants;
      }
    });
  }

}
