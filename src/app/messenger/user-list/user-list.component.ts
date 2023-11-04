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

  participantId: number;

  @Output()
  participantSelected: EventEmitter<Participant> = new EventEmitter;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngDoCheck(){
  }

  selectParticipant(participant: Participant) {
    this.participantId = participant.id as number;
    this.currentParticipant = participant as Participant;
    this.participantSelected.emit(this.currentParticipant);
  }

  // @ts-ignore
  asIsOrder(a, b) {
    if (a.value.lastMessage < b.value.lastMessage) return 1;
    if (a.value.lastMessage > b.value.lastMessage) return -1;
    return 0;
  }

}
