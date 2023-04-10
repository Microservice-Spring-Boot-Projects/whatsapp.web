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

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
  }

  postMessage() {
    if(!this.accountIdentifier){
      console.log("gibt et nicht");
      return;
    }
    let message = new Message();
    message.text = this.messageText;
    message.accountIdentifier = this.accountIdentifier;
    message.participant = this.currentParticipant;
    console.log(message);
    this.messageService.postMessage(message).subscribe({
      next: (v) => {
        this.messageText = "";
        //this.messages.unshift(v as Message);
      }
    });
  }

}
