import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Participant, SalesOrder } from 'src/app/pojos';
import { SalesService } from 'src/app/sales.service';

@Component({
  selector: 'sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrl: './sales-overview.component.css'
})
export class SalesOverviewComponent implements AfterViewInit {

  @Input() currentParticipant?: Participant;
  @Input() eventsMsg: Observable<void>;

  private eventsSubscription: Subscription;

  particiapantsSalesOrders: SalesOrder[];

  constructor(private salesService: SalesService) {
  }

  ngAfterViewInit(): void {
    this.eventsSubscription = this.eventsMsg.subscribe(() => this.listSalesOrders());
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentParticipant = changes['currentParticipant'].currentValue;
    //this.listSalesOrders();
  }

  listSalesOrders(): void {
    if (this.currentParticipant)
      this.salesService.listSalesOrders(this.currentParticipant?.id as number).subscribe({
        next: (v) => {
          this.particiapantsSalesOrders = v;
        }
      });
  }

}
