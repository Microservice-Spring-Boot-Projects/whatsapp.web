import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from "../../message.service";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  @Input() accountIdenfier: string = "";

  participants = [];

  ngOnInit(): void {
    this.findParticipants("15550501552");
  }

  findParticipants(accountIdenifier: string){
    this.messageService.findParticipants(accountIdenifier).subscribe({
      next: (v) => {
        this.participants = v;
      }
    });
  }

}
