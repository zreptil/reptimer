import {Component, Input} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {DayData} from '@/_models/day-data';
import {YearData} from '@/_models/year-data';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cal-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css'],
  standalone: false
})
export class MonthComponent {
  days: DayData[];
  weeks: { nr: number, days: DayData[] }[];
  dayNames: string[];

  @Input()
  navigation = false;

  constructor(public ss: SessionService,
              private router: Router) {
    this.dayNames = [];
    for (const day of [0, 1, 2, 3, 4, 5, 6]) {
      this.dayNames.push(YearData.weekdayName(day, true));
    }
  }

  get class(): string {
    return this.navigation ? '' : 'year';
  }

  _update: Observable<any> = null;

  @Input()
  set update(value: any) {
    this._update = of(value);
    if (this._update != null) {
      this._update.subscribe(data => {
        this.fillData();
      });
    }
  }

  _month: number;

  get month(): number {
    return this._month;
  }

  @Input()
  set month(value: number) {
    this._month = value;
    this.fillData();
  }

  _year: number;

  get year(): number {
    return this._year;
  }

  @Input()
  set year(value: number) {
    this._year = value;
    this.fillData();
  }

  get name(): string {
    let ret = YearData.monthName(this.month);
    if (this.navigation) {
      ret += ' ' + this.year;
    }
    return ret;
  }

  fillData(): void {
    this.weeks = [];
    const beg = new Date(this.year, this.month - 1, 1).getTime();
    const end = new Date(this.year, this.month, 0).getTime();
    this.days = this.ss.calendar.days.filter((value) => {
      return value.date >= beg && value.date <= end;
    });
    if (this.days.length === 0) {
      return;
    }
    let week = this.days[0].week;
    this.weeks.push({nr: week, days: []});
    for (const day of this.days) {
      if (day.week === week) {
        this.weeks[this.weeks.length - 1].days.push(day);
      } else {
        this.weeks.push({nr: day.week, days: [day]});
      }
      week = day.week;
    }
    if (this.weeks[this.weeks.length - 1].days.length === 0) {
      this.weeks.splice(this.weeks.length - 1, 1);
    }
    while (this.weeks[0].days.length < 7) {
      this.weeks[0].days.splice(0, 0, new DayData());
    }
    while (this.weeks[this.weeks.length - 1].days.length < 7) {
      this.weeks[this.weeks.length - 1].days.push(new DayData());
    }
  }

  activateDay(day: DayData): void {
    this.ss.session.day = day;
    this.ss.saveSession();
    this.router.navigate(['dashboard']);
  }

  prevMonth(): void {
    this.ss.addMonth(-1);
    this.ss.saveSession();
    this.fillData();
  }

  nextMonth(): void {
    this.ss.addMonth(1);
    this.ss.saveSession();
    this.fillData();
  }
}

