import {Component, Input, OnInit} from '@angular/core';
import {AccountProperty} from "../../../pojos";
import {UserConfigService} from "../../../user-config.service";

@Component({
  selector: 'process-values',
  templateUrl: './process-values.component.html',
  styleUrls: ['./process-values.component.css']
})
export class ProcessValuesComponent implements OnInit {

  @Input()
  accountProperties: AccountProperty[];

  constructor(private userConfigService: UserConfigService) { }

  ngOnInit(): void {
    console.log(this.accountProperties);
  }

  updateProperty(accountProperty: AccountProperty): void {
    this.userConfigService.updateAccountProperty(accountProperty).subscribe({
      next: (v) => {

      }
    });
  }

}
