import {Component, Input, OnInit} from '@angular/core';
import {Account, AccountProperty} from "../../../pojos";

@Component({
  selector: 'process-values',
  templateUrl: './process-values.component.html',
  styleUrls: ['./process-values.component.css']
})
export class ProcessValuesComponent implements OnInit {

  @Input()
  accountProperties: AccountProperty[];

  constructor() { }

  ngOnInit(): void {
    console.log(this.accountProperties);
  }
}
