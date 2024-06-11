import {Component, Input, OnInit} from '@angular/core';
import {AccountProperty} from "../../../pojos";
import {UserConfigService} from "../../../user-config.service";
import {GlobalService} from "../../../global.service";

@Component({
  selector: 'process-values',
  templateUrl: './process-values.component.html',
  styleUrls: ['./process-values.component.css']
})
export class ProcessValuesComponent implements OnInit {

  @Input()
  accountProperties: AccountProperty[];

  constructor(private userConfigService: UserConfigService,
              private globalService: GlobalService) { }

  ngOnInit(): void {
    console.log(this.accountProperties);
  }

  updateProperty(accountProperty: AccountProperty): void {
    this.userConfigService.updateAccountProperty(accountProperty).subscribe({
      next: (v) => {
        //this.globalService.
      },
      error: (v) => {
        this.globalService.openError("error.processValues.updateFailure","common.close")
      }
    });
  }

}
