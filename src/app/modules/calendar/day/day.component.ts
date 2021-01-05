import {Component, Input, OnInit} from '@angular/core';
import {DayData} from '@/_models/day-data';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cal-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input()
  day: DayData;

  constructor() {
  }

  ngOnInit(): void {
  }

}
