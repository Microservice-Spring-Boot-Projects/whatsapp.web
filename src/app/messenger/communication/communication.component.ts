import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MessageService} from "../../message.service";
import {Media, Message, Participant} from "../../pojos";
import {environment} from "../../../environments/environment";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  constructor(private messageService: MessageService
    ,private _sanitizer: DomSanitizer) {
  }

  @Input() accountIdentifier: string = "";
  @Input() currentParticipant?: Participant;

  @ViewChild('scrollViewport')
  // @ts-ignore
  private cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  itemSize: number = 25;
  messageText?: string;

  ngOnChanges(changes: SimpleChanges) {
    this.scrollViewport();
  }

  public imagePath(media: Media): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl('data:' + media.contentType + ';base64,' + media.content);
  }

  scrollViewport(){
    if(this.cdkVirtualScrollViewport)
      setTimeout(() => {
        this.cdkVirtualScrollViewport.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      },500);
  }

  ngOnInit(): void {
    this.scrollViewport();
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
