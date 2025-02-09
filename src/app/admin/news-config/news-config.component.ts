import {Component, Input, OnInit} from '@angular/core';
import {UserConfigService} from "../../user-config.service";
import {Account, AccountProperty} from "../../pojos";

@Component({
  selector: 'app-news-config',
  templateUrl: './news-config.component.html',
  styleUrls: ['./news-config.component.css']
})
export class NewsConfigComponent implements OnInit {

  constructor(private userService: UserConfigService) { }

  @Input()
  accountIdentifier: string;
  accountProperties: AccountProperty[] = [];

  ngOnInit(): void {
    this.userService.getAccountData(this.accountIdentifier).subscribe({
        next: (v) => {
          this.accountProperties = (v as Account).account_properties as AccountProperty[];
        }
      }
    );
  }

  filterProperties(propertyType: string): AccountProperty[] {
    return this.accountProperties.filter(acPr => (acPr.property_type as string) == propertyType);
  }
}
