import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MessageService} from "../../message.service";
import {Message} from "../../pojos";

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  @Input() accountIdentifier: string = "";
  @Input() currentParticipantId: number = 0;

  messages: Message[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentParticipantId != 0)
      this.findMessages(this.accountIdentifier, this.currentParticipantId);
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


}
