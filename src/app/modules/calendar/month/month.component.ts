import {Component, Input, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {DayData} from '@/_models/day-data';
import {YearData} from '@/_models/year-data';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cal-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  days: DayData[];
  weeks: { nr: number, days: DayData[] }[];

  constructor(public ss: SessionService) {
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
    return YearData.monthName(this.month);
  }

  fillData(): void {
    this.weeks = [];
    this.days = this.ss.session.year.days.filter((value) => {
      return value.month === this.month && value.year === this.year;
    });
    if (this.days.length === 0) {
      return;
    }
    console.log(this.month, this.days.length, this.ss.session.year);
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
    let idx = 7 - this.weeks[0].days.length;
    while (idx > 0) {
      this.weeks[0].days.splice(0, 0, new DayData());
      idx--;
    }
    idx = 7 - this.weeks[this.weeks.length - 1].days.length;
    while (idx > 0) {
      this.weeks[this.weeks.length - 1].days.push(new DayData());
      idx--;
    }
  }

  ngOnInit(): void {
  }

}
