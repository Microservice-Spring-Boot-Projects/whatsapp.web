import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MessageService} from "../../message.service";
import {Message, Participant} from "../../pojos";

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
    if (this.currentParticipant)
      this.findMessages(this.accountIdentifier, this.currentParticipant.id as number);
  }

  ngOnInit(): void {
  }

  findMessages(accountIdentifier: string, participantId: number) {
    this.messageService.findMessages(accountIdentifier, participantId).subscribe({
      next: (v) => {
        this.messages = v as Message[];
        console.log(this.messages);
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
