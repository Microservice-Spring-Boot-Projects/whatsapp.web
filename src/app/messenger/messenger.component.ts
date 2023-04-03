import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MessageService} from "../message.service";

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  constructor() {}

  accountIdentifier: string = "15550501552";
  currentParticipantId: number = 0;

  ngOnInit(): void {
  }

  handleParticipantChange(value : number){
    this.currentParticipantId = value;
  }

}
