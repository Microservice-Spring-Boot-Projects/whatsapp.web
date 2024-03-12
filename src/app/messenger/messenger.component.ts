import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {AccountProperty, Message, Participant} from "../pojos";
import {WebsocketService} from "../websocket.service";
import {MessageService} from "../message.service";
import {environment} from "../../environments/environment";
import structuredClone from '@ungap/structured-clone';
import {GlobalService} from "../global.service";

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  constructor(private websocketService: WebsocketService
    , private messageService: MessageService
    , private globalService: GlobalService
  ) {
  }

  @Input() accountIdentifier: string = "";
  @Input() accountId: number = 0;
  @Input() templates: AccountProperty[] = [];
  @Input() standards: AccountProperty[] = [];

  currentParticipant?: Participant;
  map = new Map<number, Participant>();

  ngOnChanges(changes: SimpleChanges) {
  }

  async ngOnInit() {
    this.websocketService.setAccountId(this.accountId);
    this.websocketService.onWebsocketEvent(this.handleMsg.bind(this));
    this.websocketService.connect();
    await this.findParticipants(this.accountIdentifier);
  }

  handleMsg(message: Message) {
    if (message.type == 1) {
      this.globalService.openError(message.text as string,"Schließen!");
      return;
    }
    let participant = this.map.get(message.participant?.id as number) as Participant;
    if (participant) {
      if (!participant.messages || participant.messages.size == 0)
        this.findMessages(this.accountIdentifier, participant.id as number).then(values => {
          participant.messages = values;
          this.refreshParticipant(participant, message);
        });
      else
        this.refreshParticipant(participant, message);
    } else {
      let newParticipant = message.participant as Participant;
      if (!newParticipant.newMessageCount) newParticipant.newMessageCount = 1;
      else newParticipant.newMessageCount = newParticipant.newMessageCount as number + 1;
      this.map.set(newParticipant.id as number, newParticipant);
    }
  }

  private refreshParticipant(participant: Participant, message: Message) {
    participant = this.map.get(message.participant?.id as number) as Participant;
    participant.messages.set(message.id as number, message);
    if (this.currentParticipant?.id != participant.id) {
      if (!participant.newMessageCount) participant.newMessageCount = 1;
      else participant.newMessageCount = participant.newMessageCount as number + 1;
    }
    // @ts-ignore
    participant.lastMessage = Date.parse(message.created_at_format);
    this.map.set(participant.id as number, participant);
    //need to copy the map object. Because otherwise ngOnChange is not triggered
    //perhaps find better way anytime
    this.map = structuredClone(this.map);
    if (this.currentParticipant?.id == participant.id)
      this.currentParticipant = participant;
  }

  /**Is called when user is selected*/
  handleParticipantChange(value: Participant) {
    let participant = this.map.get(value.id as number) as Participant;
    if (!participant.messages || participant.messages.size == 0)
      this.findMessages(this.accountIdentifier, value.id as number).then(
        values => {
          participant.messages = values
          participant.newMessageCount = 0;
          this.map.set(value.id as number, participant);
          this.currentParticipant = this.map.get(value.id as number) as Participant;
        });
    else {
      this.currentParticipant = this.map.get(value.id as number) as Participant;
      this.currentParticipant.newMessageCount = 0;
    }
  }

  async findParticipants(accountIdenifier: string) {
    this.messageService.findParticipants(accountIdenifier).subscribe({
      next: (v) => {
        let participants = v as Participant[];
        participants.forEach(participant => {
          this.map.set(participant.id as number, participant);
        });
        if (!environment.production)
          console.log(this.map);
      }
    });
  }

  async findMessages(accountIdentifier: string, participantId: number): Promise<Map<number, Message>> {
    let messages = await this.messageService.findMessages(accountIdentifier, participantId).toPromise() as Message[];
    let messageMap = new Map<number, Message>();
    messages.forEach(message => {
      messageMap.set(message.id as number, message);
    });
    if (!environment.production)
      console.log(messageMap);
    return messageMap;
  }

}
