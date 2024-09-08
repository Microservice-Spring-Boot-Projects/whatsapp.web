import {Component, AfterViewInit, Input, NgModule} from '@angular/core';
import {GlobalService} from "../../../global.service";
import {ToolService} from "../../../tool.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {environment} from "../../../../environments/environment";
import {FormsModule} from "@angular/forms";
import {Template} from "../../../pojos";
import {MatInput} from "@angular/material/input";

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
    MatInput
  ],
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.css'
})
export class BroadcastComponent implements AfterViewInit{

  constructor(private toolService: ToolService
    , private globalService: GlobalService) {
  }

  @Input()
  accountIdentifier: string;
  templates: Template[];
  currentTemplate: Template;

  ngAfterViewInit(): void {
    this.readTemplates(this.accountIdentifier);
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

  }

  protected readonly String = String;
}
