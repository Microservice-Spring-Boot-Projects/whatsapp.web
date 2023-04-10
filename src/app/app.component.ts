import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {UserConfigService} from "./user-config.service";
import {User} from "./pojos";

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

  constructor(private readonly keycloak: KeycloakService,
              private userConfigService: UserConfigService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.initUser(this.userProfile.username as string)
    } else this.initiateSession();
  }

  initUser(username: string): any {
    this.userConfigService.getuser(username).subscribe({
      next: (v) => {
        let user: User = v as User;
        user.company?.forEach(company => {
            company.accounts?.forEach(account => {
              if(account.type == 'whatsapp')
                this.accountIdentifier = account.identifier;
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
