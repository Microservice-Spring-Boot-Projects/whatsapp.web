import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from "../../message.service";
import {Participant} from "../../pojos";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  @Input() accountIdentifier: string = "";
  @Input() currentParticipantId: number = 0;

  participants: Participant[] = [];

  ngOnInit(): void {
    this.findParticipants("15550501552");
  }

  findParticipants(accountIdenifier: string) {
    this.messageService.findParticipants(accountIdenifier).subscribe({
      next: (v) => {
        this.participants = v as Participant[];
      }
    });
  }

  @Output()
  participantSelected: EventEmitter<number> = new EventEmitter;

  selectParticipant(participant: Participant) {
    this.currentParticipantId = participant.id as number;
    this.participantSelected.emit(this.currentParticipantId);
  }


}
