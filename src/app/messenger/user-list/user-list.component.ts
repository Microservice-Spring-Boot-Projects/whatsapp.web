import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
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

  @Output()
  participantSelected: EventEmitter<Participant> = new EventEmitter;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  selectParticipant(participant: Participant) {
    this.currentParticipant = participant as Participant;
    this.participantSelected.emit(this.currentParticipant);
  }


}
