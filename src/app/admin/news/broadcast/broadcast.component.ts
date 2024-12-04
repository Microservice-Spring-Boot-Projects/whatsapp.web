import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';
import {GlobalService} from "../../../global.service";
import {ToolService} from "../../../tool.service";
import {environment} from "../../../../environments/environment";
import {Template, TemplateRequest} from "../../../pojos"
import {MessageService} from "../../../message.service";
import { UploadService } from 'src/app/upload.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BroadcastComponent implements AfterViewInit{

  constructor(private toolService: ToolService
    , private globalService: GlobalService
    , private messageService: MessageService
    , private uploadService: UploadService) {
  }

  @Input() accountIdentifier: string;
  templates: Template[];
  currentTemplate: Template;
  templateRequest: TemplateRequest;
  uploadfile: any;
  filename: string = '';


  ngAfterViewInit(): void {
    this.readTemplates(this.accountIdentifier);
    this.templateRequest = new TemplateRequest();
    this.templateRequest.accountIdentifier = this.accountIdentifier;
  }

  onTemplateSelect(){
    if(!environment.production)
      console.log(this.currentTemplate as Template);
  }

  readTemplates(accountIdentifier: string):void {
    this.toolService.readTemplates(accountIdentifier).subscribe(
      {
        next: (v) => {
          this.templates = v.data;
          if(!environment.production)
            console.log(this.templates);
        },
        error: (v) => {
          this.globalService.openError(v.error,"Schließen");
        }
      }
    );
  }

  isVariable(text: string, index: number): boolean{
    return (text as string).includes('{{' + index + '}}');
  }

  sendTemplate(): void {
    if(!environment.production)
      console.log(this.templateRequest);
    this.templateRequest.templateName = this.currentTemplate.name;
    if(this.uploadfile) {
      this.sendTemplateAndUpload();
      return;
    } else {
      this.messageService.postTemplate(this.templateRequest).subscribe({
        next: (v) => {
          this.globalService.openStatus("Templage wurde verschickt.","Schliessen");
          console.log(v);
        },
        error: (v) => {
          this.globalService.openError(v.error,"Schließen");
        }
      });
    }
  }

  sendTemplateAndUpload(): void {
    this.uploadService.upload(this.uploadfile,this.templateRequest).subscribe({
      next:(v) => {
        console.log(v);
        this.globalService.openStatus("Templage wurde verschickt.","Schliessen");
      },
      error: (v) => {
        this.globalService.openError(v.error,"Schließen");
      }
    });
  }

  onkeyup(event: KeyboardEvent) {
    console.log(event.target);
  }

  replaceLineBreaks(value: string): string{
    return value.replace(/\n/g,'<br/>');
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.uploadfile = inputNode.files[0];
    this.filename = this.uploadfile.name;
    console.log(this.uploadfile.name);
  }

  protected readonly String = String;
}

