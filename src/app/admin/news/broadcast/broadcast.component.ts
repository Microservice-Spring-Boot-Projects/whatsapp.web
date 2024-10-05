import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';
import {GlobalService} from "../../../global.service";
import {ToolService} from "../../../tool.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {environment} from "../../../../environments/environment";
import {FormsModule} from "@angular/forms";
import {Template, TemplateRequest} from "../../../pojos";
import {MatInput} from "@angular/material/input";
import {MessageService} from "../../../message.service";
import {AppModule} from "../../../app.module";

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    FormsModule,
    MatInput,
    AppModule
  ],
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BroadcastComponent implements AfterViewInit{


  constructor(private toolService: ToolService
    , private globalService: GlobalService
    , private messageService: MessageService) {
  }

  @Input()
  accountIdentifier: string;
  templates: Template[];
  currentTemplate: Template;
  templateRequest: TemplateRequest;


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
    this.messageService.postTemplate(this.templateRequest).subscribe({
      next: (v) => {
        console.log(v);
      },
      error: (v) => {
        this.globalService.openError(v.error,"Schließen");
      }
    });
  }

  onkeyup(event: KeyboardEvent) {
    console.log(event);
  }

  replaceLineBreaks(value: string): string{
    return value.replace('\n','<br/>');
  }

  protected readonly String = String;
}

