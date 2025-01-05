import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from 'src/environments/environment';
import { UserProfile } from './pojos';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;
  private _userProfile: UserProfile | undefined;
  authenticated: boolean = false;

  get keycloak() {
    if(!this._keycloak) {
      this._keycloak = new Keycloak({
        url: environment.KEYCLOAK_URL,
        realm: environment.KEYCLOAK_REALM,
        clientId: 'whatsapp-ml'
      });
    }
    return this._keycloak;
  }

  get userProfile() : UserProfile | undefined {
    return this._userProfile;
  }

  constructor() { }

  async init() {
    console.log("Authentication of user....");
    this.authenticated = await this.keycloak?.init({
      onLoad: 'login-required'
    });
    if(this.authenticated) {
      this._userProfile = (await this.keycloak?.loadUserInfo()) as UserProfile;
      this._userProfile.token = this.keycloak?.token;
    }
  }

  login() {
    return this.keycloak?.login();
  }

  logout() {
    return this.keycloak?.logout();
  }
}
