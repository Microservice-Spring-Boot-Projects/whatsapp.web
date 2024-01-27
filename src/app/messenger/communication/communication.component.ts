import {Component, Input, OnInit, SimpleChanges, ViewChild, NgZone} from '@angular/core';
import {MessageService} from "../../message.service";
import {AccountProperty, Media, Message, Participant} from "../../pojos";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {GlobalService} from "../../global.service";
import {UserConfigService} from "../../user-config.service";
import {environment} from "../../../environments/environment";
import {take} from 'rxjs/operators';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  constructor(private messageService: MessageService
    ,private _sanitizer: DomSanitizer
    ,private globalService: GlobalService
    ,private userConfigService: UserConfigService
    ,private _ngZone: NgZone) {
  }

  @Input() accountIdentifier: string = "";
  @Input() accountId: number = 0;
  @Input() currentParticipant?: Participant;
  @Input() templates : AccountProperty[] = [];
  @Input() standards : AccountProperty[] = [];

  @ViewChild('scrollViewport')
  // @ts-ignore
  private cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  itemSize: number = 25;
  messageText?: string;
  templateText?: string;
  standardText?: string;

  ngOnChanges(changes: SimpleChanges) {
    this.scrollViewport();
  }

  public imagePath(media: Media): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl('data:' + media.contentType + ';base64,' + media.content);
  }

  downloadFile(media: Media){
    const src = 'data:'+ media.contentType+';base64,'+media.content;
    let link = document.createElement("a");
    link.href = src;
    link.download = media.name as string;
    link.click();
    link.remove();
  }

  scrollViewport(){
    if(this.cdkVirtualScrollViewport)
      setTimeout(() => {
        this.cdkVirtualScrollViewport.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      },1500);
  }

  ngOnInit(): void {
    this.scrollViewport();
  }

  onStandardSelect(){
    console.log(typeof this.standardText);
    if(this.standardText)
      this.messageText = this.standardText;
  }

  postMessage() {
    if(
      /** Account identifier cannot be missing. this whatsapp account **/
      !this.accountIdentifier ||
      /** Message mustn't be null or empty! Later it could be an attachment**/
      ((!this.messageText || this.messageText.trim().length == 0) && (!this.templateText || this.templateText.trim().length == 0))
      /** There must be a receiver of a message. **/
      || !this.currentParticipant
    ){
      if(!environment.production)
        console.log("not enough data.")
      return;
    }
    let message = new Message();
    message.text = this.messageText ? this.messageText : this.templateText;
    message.type = this.templateText ? 1 : 0;
    message.accountIdentifier = this.accountIdentifier;
    message.participant = this.currentParticipant;
    this.messageService.postMessage(message, this.accountId).subscribe({
      next: (v) => {
        this.messageText = "";
        if(this.templateText)
          this.templateText = undefined;
      }
      , error: (v) => {
        console.log(v.error);
        this.globalService.openError(this.globalService.getMessageFromCode(v.error),"Close");
      }
    });
  }

}
