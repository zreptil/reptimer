import {Component, Input, OnInit} from '@angular/core';
import {DayData} from '@/_models/day-data';
import {YearData} from '@/_models/year-data';

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

  dayClass(day: DayData): any {
    const ret = ['day', 't' + day.type];
    if (YearData.dayOfWeek(new Date(day.date)) === 6) {
      ret.push('w6');
    }
    if (day.info != null && day.info.trim() !== '') {
      ret.push('info');
    }
    return ret;
  }

  ngOnInit(): void {
  }

}
