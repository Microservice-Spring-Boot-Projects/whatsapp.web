import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Message, Participant} from "../pojos";
import {WebsocketService} from "../websocket.service";
import {MessageService} from "../message.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

constructor(private websocketService: WebsocketService
            ,private messageService: MessageService
) {}

  @Input() accountIdentifier: string = "";

  currentParticipant?: Participant;
  map = new Map<number, Participant>();

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
    this.websocketService.onWebsocketEvent(this.doThis.bind(this));
    this.websocketService.connect();
    this.findParticipants(this.accountIdentifier);
  }

  doThis(message: Message) {
    console.log("mega: "+message.text);
  }

  handleParticipantChange(value : Participant){
    let participant = this.map.get(value.id as number) as Participant;
    if(!participant.messages || participant.messages.size == 0)
      this.findMessages(this.accountIdentifier, value.id as number);
    this.currentParticipant = this.map.get(value.id as number) as Participant;;
  }

  findParticipants(accountIdenifier: string) {
    this.messageService.findParticipants(accountIdenifier).subscribe({
      next: (v) => {
        let participants = v as Participant[];
        participants.forEach(participant => {
          this.map.set(participant.id as number, participant);
        });
      }
    });
  }

  findMessages(accountIdentifier: string, participantId: number) {
    this.messageService.findMessages(accountIdentifier, participantId).subscribe({
      next: (v) => {
        let messages = v as Message[];
        let participant = this.map.get(participantId) as Participant;
        participant.messages = new Map<number,Message>();
        messages.forEach(message => {
          participant.messages.set(message.id as number, message);
        });
        this.map.set(participantId,participant);
        if (!environment.production)
          console.log(v);
      }
    });
  }

}
