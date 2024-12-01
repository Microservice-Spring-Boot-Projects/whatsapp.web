import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Participant} from "../../pojos";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../../environments/environment";
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor() {
  }

  private eventsSubscription: Subscription;

  @Input() currentParticipant?: Participant;
  @Input() map?: Map<number, Participant>;
  @Input() events: Observable<void>;

  participantList: Participant[];
  participantId: number;
  searchTxt: string = "";

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  menuTopLeftPosition = { x: '0', y: '0' }

  @Output()
  participantSelected: EventEmitter<Participant> = new EventEmitter;

  ngOnInit(): void {
    if(!environment.production)
      console.log("ngOnInit(): void");
    this.eventsSubscription = this.events.subscribe(() => this.userSearch());
  }

  ngDoCheck() {
  }

  ngOnDestroy(){
    if(!environment.production)
      console.log("ngOnDestroy()");
    this.eventsSubscription.unsubscribe();
  }

  selectParticipant(participant: Participant) {
    if(!environment.production)
      console.log("selectParticipant(participant: Participant)");
    this.participantId = participant.id as number;
    this.currentParticipant = participant as Participant;
    this.participantSelected.emit(this.currentParticipant);
  }

  searchUser() {
    if(!environment.production)
      console.log("searchUser(event: KeyboardEvent)");
    this.userSearch();
  }

  private userSearch() {
    if(!environment.production){
      console.log("private userSearch(key: string)");
      console.log("searchTxt: " + this.searchTxt);
    }
    this.participantList = Array.from((this.map as Map<number, Participant>).values())
      .filter((item: Participant) => item.participantName?.toLowerCase().includes(this.searchTxt.toLowerCase()) || item.participantMobile?.includes(this.searchTxt))
      .sort((a, b) => {
          let aLastMessage = a.lastMessage as number;
          let bLastMessage = b.lastMessage as number;
          if (aLastMessage < bLastMessage) return 1;
          if (aLastMessage > bLastMessage) return -1;
          return 0;
        }
      );
  }

  onRightClick(event: any) {
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.openMenu();
  }

}
