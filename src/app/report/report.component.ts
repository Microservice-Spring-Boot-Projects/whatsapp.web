import {Component, Input, OnInit} from '@angular/core';
import {Company} from "../pojos";

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @Input() company: Company;

  constructor() { }

  ngOnInit(): void {
  }



}
