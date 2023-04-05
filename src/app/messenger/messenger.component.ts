import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Participant} from "../pojos";
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

constructor(private websocketService: WebsocketService) {}

  accountIdentifier: string = "15550501552";
  currentParticipant?: Participant;

  ngOnInit(): void {
    this.websocketService.connect();
  }

  handleParticipantChange(value : Participant){
    this.currentParticipant = value;
  }

}
