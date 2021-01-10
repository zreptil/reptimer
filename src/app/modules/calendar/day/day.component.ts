import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DayData} from '@/_models/day-data';
import {SessionService} from '@/_services/session.service';
import {Observable} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cal-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input()
  day: DayData;
  @Output()
  clickEvent = new EventEmitter<DayData>();

  constructor(private ss: SessionService) {
  }

  dayClass(day: DayData): any {
    const ret = ['day', 't' + day.type];
    if (DayData.dayOfWeek(new Date(day.date)) === 6) {
      ret.push('w6');
    }
    if (day.info != null && day.info.trim() !== '') {
      ret.push('info');
    }
    if (day.isSameDay(this.ss.session.day)) {
      ret.push('active');
    }
    if (day.times.length > 0) {
      ret.push('hastimes');
    }
    const c = new Date(day.date).toLocaleDateString();
    const t = new Date(Date.now()).toLocaleDateString();
    if (c === t) {
      ret.push('today');
    }
    return ret;
  }

  ngOnInit(): void {
  }

}
