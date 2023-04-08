import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MessageService} from "../../message.service";
import {Message, Participant} from "../../pojos";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  @Input() accountIdentifier: string = "";
  @Input() currentParticipant?: Participant;

  messageText?: string;

  messages: Message[] = [];

  ngOnChanges(changes: SimpleChanges) {
    let change = changes['currentParticipant'];
    if (!change.firstChange)
      this.findMessages(this.accountIdentifier, change.currentValue.id as number);
  }

  ngOnInit(): void {
  }

  findMessages(accountIdentifier: string, participantId: number) {
    this.messageService.findMessages(accountIdentifier, participantId).subscribe({
      next: (v) => {
        this.messages = v as Message[];
        if (!environment.production)
          console.log(v);
      }
    });
  }

  postMessage() {
    let message = new Message();
    message.text = this.messageText;
    message.accountIdentifier = this.accountIdentifier;
    message.participant = this.currentParticipant;
    this.messageService.postMessage(message).subscribe({
      next: (v) => {
        this.messageText = "";
        this.messages.unshift(v as Message);
      }
    });
  }

}
