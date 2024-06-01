import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private _snackBar: MatSnackBar) { }

  openError(message: string, action: string, durationMillis?: number) {
    if (message.length > 3000) message = message.substring(0, 3000);
    if (durationMillis)
      this._snackBar.open(message, action, {
        duration: durationMillis,
        panelClass: ['red-snackbar']
      });
    else
      this._snackBar.open(message, action, {
        panelClass: ['red-snackbar']
      });
  }

  getMessageFromCode(code: string) : string{
    if(code == 'UNAUTHORIZED_REST_CALL')
      return "WhatsApp Token is not valid. Contact administrator!";
    else if(code == 'WHATSAPP_NO_TEMPLATE')
      return "Ausgewähltes Template existiert nicht!";
    return "undefined error message"
  }

}
