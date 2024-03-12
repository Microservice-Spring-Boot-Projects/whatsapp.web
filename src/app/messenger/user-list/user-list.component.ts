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

  @Input() currentParticipant?: Participant;
  @Input() map?: Map<number, Participant>;

  participantList: Participant[];

  participantId: number;

  @Output()
  participantSelected: EventEmitter<Participant> = new EventEmitter;

  ngOnInit(): void {
    setTimeout(() => {
      this.userSearch('');
    }, 2000);  //5s
  }

  ngDoCheck() {
  }

  selectParticipant(participant: Participant) {
    this.participantId = participant.id as number;
    this.currentParticipant = participant as Participant;
    this.participantSelected.emit(this.currentParticipant);
  }

  searchUser(event: KeyboardEvent) {
    this.userSearch((event.target as HTMLInputElement).value);
  }

  private userSearch(key: string) {
    this.participantList = Array.from((this.map as Map<number, Participant>).values())
      .filter((item: Participant) => item.participantName?.toLowerCase().includes(key.toLowerCase()) || item.participantMobile?.includes(key))
      .sort((a, b) => {
          let aLastMessage = a.lastMessage as number;
          let bLastMessage = b.lastMessage as number;
          if (aLastMessage < bLastMessage) return 1;
          if (aLastMessage > bLastMessage) return -1;
          return 0;
        }
      );
  }
}
