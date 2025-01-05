import {Component,  ComponentRef,  ElementRef,  OnInit,  ViewChild,  ViewContainerRef} from '@angular/core';
import {UserConfigService} from "./user-config.service";
import {AccountProperty, Company, User} from "./pojos";
import {environment} from "../environments/environment";
import {MessengerComponent} from "./messenger/messenger.component";
import {NewsConfigComponent} from "./admin/news-config/news-config.component";
import {ReportComponent} from "./report/report.component";
import {HostListener} from "@angular/core";
import {BroadcastComponent} from "./admin/news/broadcast/broadcast.component";
import { SalesComponent } from './sales/sales.component';
import { KeycloakService } from './keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('mainContent') mainContent: ElementRef;
  title = 'whatsapp.web';
  // @ts-ignore
  webSocketAPI: WebSocketAPI;
  greeting: any;
  // @ts-ignore
  name: string;
  public isLoggedIn = false;
  
  accountIdentifier?: string;
  accountId?: number;
  company: Company;
  templates: AccountProperty[] = [];
  standards: AccountProperty[] = [];

  screenHeight: number;
  screenWidth: number;

  public isWhatsappAdmin: boolean = false;
  public isReportUser: boolean = false;
  public isWhatsappNewsletter: boolean = false;
  public isWhatsappSales: boolean = false;
  public salesModuleActive: boolean = false;

  constructor(private readonly keycloak: KeycloakService,
              private userConfigService: UserConfigService,
              private _ViewContainerRef: ViewContainerRef) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log(this.screenHeight, this.screenWidth);
  }

  public async ngOnInit(): Promise<void> {
      if (this.keycloak.authenticated) {
        this.isLoggedIn = this.keycloak.authenticated;
        this.isWhatsappAdmin = this.keycloak.keycloak.hasRealmRole('whatsapp-admin');
        this.isReportUser = this.keycloak.keycloak.hasRealmRole('whatsapp-report');
        this.isWhatsappNewsletter = this.keycloak.keycloak.hasRealmRole('whatsapp-newsletter');
        this.isWhatsappSales = this.keycloak.keycloak.hasRealmRole('whatsapp-sales');
        if(!environment.production){
          console.log(this.keycloak.userProfile);
          console.log(this.isWhatsappAdmin);
          console.log(this.isReportUser);
          console.log(this.isWhatsappNewsletter);
          console.log(this.isWhatsappSales);
        }
    }
    this.initUser(this.keycloak.userProfile?.username as string);
  }

  initUser(username: string): any {
    this.userConfigService.getuser(username).subscribe({
      next: (v) => {
        let user: User = v as User;
        user.company?.forEach(company => {
            company.accounts?.forEach(account => {
              if (account.type == 'whatsapp') {
                this.accountIdentifier = account.identifier;
                this.accountId = account.id;
                this.company = company;
                //******check if module sales is activated */
                if(account.account_properties) {
                  account.account_properties.forEach(property => {
                    if(property.property_name == 'sales.module.active') 
                      this.salesModuleActive = (property.property_value == 'true');
                  });
                }
                this.userConfigService.getTemplates(this.accountIdentifier as string).subscribe({
                  next: (v) => {
                    this.templates = v;
                    if (!environment.production)
                      console.log(this.templates);
                  }
                });
                this.userConfigService.getStandards(this.accountIdentifier as string).subscribe({
                  next: (v) => {
                    this.standards = v;
                    if (!environment.production)
                      console.log(this.standards);
                  }
                });
              }
            })
          }
        );
        return user;
      }
    });
  }

  public initiateSession() {
    this.keycloak.login();
  }

  public cancelSession() {
    this.keycloak.logout();
  }

  connect() {
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  addContent(menuId: number) {
    let component: ComponentRef <any>;
    if(menuId == 1) {
      component = this._ViewContainerRef.createComponent(MessengerComponent);
      component.instance.accountIdentifier = this.accountIdentifier;
      component.instance.accountId = this.accountId;
      component.instance.templates = this.templates;
      component.instance.standards = this.standards;
      component.instance.company = this.company;
      component.instance.isWhatsappNewsletter = this.isWhatsappNewsletter;
      component.instance.isWhatsappSales = this.isWhatsappSales;
      component.instance.mainContent = this.mainContent;
      component.instance.salesModuleActive = this.salesModuleActive;
      if(!environment.production)
        console.log(component);
    } else if(menuId == 2) {
      component = this._ViewContainerRef.createComponent(NewsConfigComponent);
      component.instance.accountIdentifier = this.accountIdentifier;
    } else if(menuId == 3){
      component = this._ViewContainerRef.createComponent(ReportComponent);
      component.instance.company = this.company;
    } else if(menuId == 4) {
      component = this._ViewContainerRef.createComponent(BroadcastComponent);
      component.instance.accountIdentifier = this.accountIdentifier;
    } else if(menuId == 5) {
      component = this._ViewContainerRef.createComponent(SalesComponent);
      component.instance.company = this.company;
      component.instance.accountId = this.accountId;
      component.instance.accountIdentifier = this.accountIdentifier;
    }
    // @ts-ignore
    const element: HTMLElement = component.location.nativeElement;
    element.contentEditable = 'false';
    this.mainContent.nativeElement.innerHTML = '';
    this.mainContent.nativeElement.appendChild(element);
  }
}
