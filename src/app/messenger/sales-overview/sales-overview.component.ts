import { Component, Input, OnInit } from '@angular/core';
import { Participant, SalesOrder } from 'src/app/pojos';
import { SalesService } from 'src/app/sales.service';

@Component({
  selector: 'sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrl: './sales-overview.component.css'
})
export class SalesOverviewComponent implements OnInit{

  @Input() currentParticipant?: Participant;
  
  particiapantsSalesOrders: SalesOrder[];

  constructor(private salesService: SalesService){
  }
  
  ngOnInit(): void {
    if(this.currentParticipant) {
      this.listSalesOrders();
      console.log("hey");
    }
  }

  listSalesOrders(): void {
    this.salesService.listSalesOrders(this.currentParticipant?.id as number).subscribe({
      next: (v) => {
        this.particiapantsSalesOrders = v;
      }
    });
  }

}
