import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {UserConfigService} from "./user-config.service";
import {AccountProperty, Company, User} from "./pojos";
import {environment} from "../environments/environment";
import {MessengerComponent} from "./messenger/messenger.component";
import {NewsConfigComponent} from "./admin/news-config/news-config.component";
import {ReportComponent} from "./report/report.component";
import {HostListener} from "@angular/core";
import {BroadcastComponent} from "./admin/news/broadcast/broadcast.component";
import { SalesComponent } from './sales/sales.component';

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
  public userProfile: KeycloakProfile | null = null;

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
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      const roles = this.keycloak.getUserRoles();
      if (!environment.production) {
        console.log(this.userProfile);
        console.log(roles);
      }
      this.isWhatsappAdmin = roles.includes('whatsapp-admin');
      this.isReportUser = roles.includes('whatsapp-report');
      this.isWhatsappNewsletter = roles.includes('whatsapp-newsletter');
      this.isWhatsappSales = roles.includes('whatsapp-sales');
      this.initUser(this.userProfile.username as string)
    } else this.initiateSession();
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
    } else if(menuId == 5) 
      component = this._ViewContainerRef.createComponent(SalesComponent);
    // @ts-ignore
    const element: HTMLElement = component.location.nativeElement;
    element.contentEditable = 'false';
    this.mainContent.nativeElement.innerHTML = '';
    this.mainContent.nativeElement.appendChild(element);
  }
}
