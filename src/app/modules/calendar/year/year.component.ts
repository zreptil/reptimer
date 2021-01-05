import {Component, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cal-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit {

  constructor(public ss: SessionService) {
  }

  ngOnInit(): void {
  }

}
