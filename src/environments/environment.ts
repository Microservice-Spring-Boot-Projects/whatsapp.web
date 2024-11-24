// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  MESSAGE_URL: "https://localhost:8445/whatsapp/messages",
  REPORT_URL: "https://localhost:8445/whatsapp/report",
  TOOL_URL: "https://localhost:8445/whatsapp/tools",
  USER_URL: "https://localhost:8447/user/user",
  ACCOUNT_USER_URL: "https://localhost:8447/user/account",
  WEBSOCKET_ENDPOINT:  "https://localhost:8445/whatsapp/websocket",
  KEYCLOAK_REALM : "missfortyTestRealm"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
