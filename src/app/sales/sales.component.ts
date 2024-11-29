import { Component, Input, OnInit } from '@angular/core';
import { Company, Participant, SalesOrder, SalesOrderPosition } from '../pojos';
import { SalesService } from '../sales.service';
import { environment } from 'src/environments/environment';
import { UserConfigService } from '../user-config.service';

@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit{

  @Input() currentParticipant: Participant | null;
  @Input() company: Company;
  @Input() accountId: number = 0;
  @Input() accountIdentifier: string;
  
  brands: [string];
  sizes: [string];
  searchTxt: string = "";
  participantList: Participant[];
  currentSalesOrder: SalesOrder;

  constructor(private salesService: SalesService
    ,private userConfigService: UserConfigService
  ) {
  }

  ngOnInit(): void {
    this.userConfigService.getLovs(this.accountIdentifier as string,'sales.brands').subscribe({
      next: (v) => {
        this.brands = v;
        if (!environment.production)
          console.log(this.brands);
      }
    });
    this.userConfigService.getLovs(this.accountIdentifier as string,'sales.sizes').subscribe({
      next: (v) => {
        this.sizes = v;
        if (!environment.production)
          console.log(this.sizes);
      }
    });
  }

  searchUser(): void {
    if(this.searchTxt && this.searchTxt.length > 0){
      this.currentParticipant = null;
      this.salesService.searchParticipant("" + this.company.id, this.searchTxt).subscribe({
        next: (v) => {
          this.participantList = v as Participant[];
          if(!environment.production)
            console.log(this.participantList);
        }
      });
    }
  }

  selectParticipant(participant: Participant) {
    this.currentParticipant = participant;
    if(!environment.production)
      console.log(this.currentParticipant);
  }

  saveParticipant() {
    if(this.currentParticipant)
      this.salesService.saveParticipant(this.currentParticipant).subscribe({
        next: (v) => {
          console.log(v);
        },
        error: (v) => {
          console.log(v);
        }
      });
  }

  addSalesOrder() {
    if(this.currentParticipant){
      if(!this.currentSalesOrder) {
        let salesOrder: SalesOrder = new SalesOrder();
        salesOrder.accountId = this.accountId;
        salesOrder.companyId = this.company.id;
        salesOrder.participant = this.currentParticipant;
        salesOrder.positions = [];
        this.currentSalesOrder = salesOrder;
      }
      let sop = new SalesOrderPosition();
      this.currentSalesOrder.positions?.push(sop);
    }
  }

  saveSalesOrder() {
    if(this.currentSalesOrder) {
      this.salesService.saveSalesOrder(this.currentSalesOrder).subscribe({
          next: (v) => {
            console.log(v);
          },
          error: (v) => {
            console.log(v);
          }
        }
      );
    }
  }


}