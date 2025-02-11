import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { AccountProperty, Company, Message, Participant } from "../pojos";
import { WebsocketService } from "../websocket.service";
import { MessageService } from "../message.service";
import { environment } from "../../environments/environment";
import { GlobalService } from "../global.service";
import { Subject } from "rxjs";
import { SalesService } from '../sales.service';

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  constructor(private websocketService: WebsocketService
    , private messageService: MessageService
    , private globalService: GlobalService
    , private salesService: SalesService
  ) {
  }

  @Input() accountIdentifier: string = "";
  @Input() accountId: number = 0;
  @Input() templates: AccountProperty[] = [];
  @Input() standards: AccountProperty[] = [];
  @Input() isWhatsappSales: boolean = false;
  @Input() company: Company;
  @Input() salesModuleActive: boolean = false;

  colspanUserList: number = 4;
  colspanSalesList: number = 0;
  colspanCommunication: number = 16;

  currentParticipant?: Participant;
  map = new Map<number, Participant>();

  eventsSubject: Subject<void> = new Subject<void>();
  eventsMsgSubject: Subject<void> = new Subject<void>();

  ngOnChanges(changes: SimpleChanges) {
  }

  emitEventToChild() {
    if (!environment.production)
      console.log("emitEventToChild()");
    this.eventsSubject.next();
  }

  emitMsgEventToChild() {
    if (!environment.production)
      console.log("emitMsgEventToChild");
    this.eventsMsgSubject.next();
  }

  async ngOnInit() {
    if (!this.salesModuleActive) {
      this.colspanUserList = 4;
      this.colspanSalesList = 0;
      this.colspanCommunication = 16;
    }
    if (!environment.production)
      console.log("async ngOnInit()");
    this.websocketService.setAccountId(this.accountId);
    this.websocketService.onWebsocketEvent(this.handleMsg.bind(this));
    this.websocketService.connect();
    await this.findParticipants(this.accountIdentifier);
  }

  handleMsg(message: Message) {
    if (!environment.production) {
      console.log("handleMsg(message: Message)");
      console.log(message);
    }
    if (message.type == 1) {
      this.globalService.openError(message.text as string, "Schließen!");
      return;
    }
    let participant = this.map.get(message.participant?.id as number) as Participant;
    if (participant) {
      if (!participant.messages || participant.messages.size == 0) {
        this.messageService.findMessages(this.accountIdentifier, participant.id as number).subscribe(
          {
            next: (v) => {
              let messages = v as Message[];
              let messageMap = new Map<number, Message>();
              messages.forEach(messageItem => {
                messageMap.set(messageItem.id as number, messageItem);
              });
              messageMap.set(message.id as number, message);
              participant.messages = messageMap;
              participant.lastMessage = Date.parse(message.created_at_format as string);
              participant.newMessageCount = 1;
              this.map.set(participant.id as number, participant);
              this.emitEventToChild();
              this.emitMsgEventToChild();
            }
          }
        );
      } else {
        this.refreshParticipant(participant, message);
      }
    } else {
      let newParticipant = message.participant as Participant;
      if (!newParticipant.newMessageCount) newParticipant.newMessageCount = 1;
      else newParticipant.newMessageCount = (newParticipant.newMessageCount as number + 1);
      this.map.set(newParticipant.id as number, newParticipant);
    }
  }

  private refreshParticipant(participant: Participant, message: Message) {
    if (!environment.production)
      console.log("refreshParticipant(participant: Participant, message: Message)");
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
    this.emitEventToChild();
    if (this.currentParticipant?.id == participant.id)
      this.currentParticipant = participant;
  }

  /**Is called when user is selected*/
  handleParticipantChange(value: Participant) {
    if (!environment.production)
      console.log("handleParticipantChange(value: Participant)");
    let participant = this.map.get(value.id as number) as Participant;
    if (!participant.messages || participant.messages.size == 0) {
      this.messageService.findMessages(this.accountIdentifier, value.id as number).subscribe(
        {
          next: (v) => {
            let messages = v as Message[];
            let messageMap = new Map<number, Message>();
            messages.forEach(message => {
              messageMap.set(message.id as number, message);
            });
            participant.messages = messageMap;
            participant.newMessageCount = 0;
            this.map.set(value.id as number, participant);
            this.currentParticipant = this.map.get(value.id as number) as Participant;
            /*logging all shown messages*/
            if (!environment.production)
              console.log(participant.messages);
            this.emitMsgEventToChild();
          }
        }
      );
      //**** we need to load the sales order when module is active *******/
      if (this.salesModuleActive) {
        this.salesService.listSalesOrders(participant.id as number).subscribe({
          next: (v) => {
            participant.salesorder = v;
            this.setColspan(participant);
            this.emitMsgEventToChild();
          }
        });
      }
    }
    else {
      this.currentParticipant = this.map.get(value.id as number) as Participant;
      this.currentParticipant.newMessageCount = 0;
      this.setColspan(this.currentParticipant);
    }
  }

  setColspan(participant: Participant) {
    if (participant.salesorder?.length == 0) {
      this.colspanUserList = 4;
      this.colspanSalesList = 0;
      this.colspanCommunication = 16;
    } else {
      this.colspanUserList = 4;
      this.colspanSalesList = 3;
      this.colspanCommunication = 13;
    }
  }

  async findParticipants(accountIdenifier: string) {
    if (!environment.production)
      console.log(" async findParticipants(accountIdenifier: string)");
    this.messageService.findParticipants(accountIdenifier).subscribe({
      next: (v) => {
        let participants = v as Participant[];
        participants.forEach(participant => {
          this.map.set(participant.id as number, participant);
        });
        this.emitEventToChild();
        if (!environment.production)
          console.log(this.map);
      }
    });
  }

}
