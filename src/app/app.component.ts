import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {UserConfigService} from "./user-config.service";
import {AccountProperty, User} from "./pojos";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  templates: AccountProperty[] = [];
  standards: AccountProperty[] = [];

  public isWhatsappAdmin = false;

  constructor(private readonly keycloak: KeycloakService,
              private userConfigService: UserConfigService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      const roles = this.keycloak.getUserRoles();
      if(!environment.production){
        console.log(this.userProfile);
        console.log(roles);
      }
      this.isWhatsappAdmin = roles.includes('admin');
      this.initUser(this.userProfile.username as string)
    } else this.initiateSession();
  }

  initUser(username: string): any {
    this.userConfigService.getuser(username).subscribe({
      next: (v) => {
        let user: User = v as User;
        user.company?.forEach(company => {
            company.accounts?.forEach(account => {
              if(account.type == 'whatsapp'){
                this.accountIdentifier = account.identifier;
                this.accountId = account.id;
                this.userConfigService.getTemplates(this.accountIdentifier as string).subscribe({
                  next:(v) => {
                    this.templates = v;
                    if(!environment.production)
                      console.log(this.templates);
                  }
                });
                this.userConfigService.getStandards(this.accountIdentifier as string).subscribe({
                  next:(v) => {
                    this.standards = v;
                    if(!environment.production)
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
}
