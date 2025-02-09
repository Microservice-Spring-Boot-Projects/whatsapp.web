import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MessengerComponent } from './messenger/messenger.component';
import { MatListModule } from '@angular/material/list';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommunicationComponent } from './messenger/communication/communication.component';
import { UserListComponent } from './messenger/user-list/user-list.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from "../environments/environment";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { NewsConfigComponent } from './admin/news-config/news-config.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProcessValuesComponent } from './admin/news-config/process-values/process-values.component';
import { ReportComponent } from './report/report.component';
import { OptinUserComponent } from "./report/optin-user/optin-user.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BroadcastComponent} from "./admin/news/broadcast/broadcast.component";
import { SalesComponent } from './sales/sales.component';
import { SalesOverviewComponent } from './messenger/sales-overview/sales-overview.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://keycloak.missforty.de',
        realm: environment.KEYCLOAK_REALM,
        clientId: 'whatsapp-ml'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/verify-sso.html'
      }
    });
}

@NgModule({ declarations: [
        AppComponent,
        MessengerComponent,
        CommunicationComponent,
        UserListComponent,
        NewsConfigComponent,
        ProcessValuesComponent,
        ReportComponent,
        OptinUserComponent,
        BroadcastComponent,
        SalesComponent,
        SalesOverviewComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatGridListModule,
        MatListModule,
        FormsModule,
        MatFormFieldModule,
        MatMenuModule,
        MatInputModule,
        MatIconModule,
        ScrollingModule,
        KeycloakAngularModule,
        MatSelectModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTabsModule,
        MatExpansionModule,
        MatTableModule,
        MatButtonModule], 
        providers: [
            {
              provide: APP_INITIALIZER,
              useFactory: initializeKeycloak,
              multi: true,
              deps: [KeycloakService]
            }
            ,provideHttpClient(withInterceptorsFromDi())
        ] 
})
export class AppModule { }
