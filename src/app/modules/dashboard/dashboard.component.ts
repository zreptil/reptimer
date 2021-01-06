import {Component} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {TimeData, TimeType} from '@/_models/time-data';
import {DialogResult, DialogResultButton} from '@/_models/dialog-data';
import {DayData} from '@/_models/day-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public dataIdx: number = null;

  constructor(public ss: SessionService) {
  }

  public get data(): TimeData {
    return this.ss.session.year.day.times[this.dataIdx];
  }

  clickPlayPause($event: MouseEvent): void {
    if (this.data == null) {
      this.ss.session.year.day.times.push(TimeData.factory());
      this.dataIdx = this.ss.session.year.day.times.length - 1;
    }
    if (this.data.start == null) {
      this.data.start = TimeData.timeFromDate(new Date(Date.now()));
      this.data.type = TimeType.Arbeitszeit;
    } else {
      this.data.end = TimeData.timeFromDate(new Date(Date.now()));
    }
    this.ss.saveSession();
  }

  clickStop($event: MouseEvent): void {
    this.data.end = TimeData.timeFromDate(new Date(Date.now()));
    this.dataIdx = null;
    this.ss.saveSession();
  }

  deleteTime(idx: number): void {
    this.ss.confirm('Wirklich löschen?').subscribe((result: DialogResult) => {
      switch (result.btn) {
        case DialogResultButton.yes:
          this.ss.session.year.day.times.splice(idx, 1);
          this.ss.saveSession();
          break;
      }
    });
  }

  toggleTime(idx: number): void {
    if (this.dataIdx !== idx) {
      this.dataIdx = idx;
    } else {
      this.dataIdx = null;
    }
  }

  timeClass(idx: number): string[] {
    const ret = [];
    if (this.dataIdx === idx) {
      ret.push('active');
    }
    return ret;
  }

  weekClass(day: DayData): string[] {
    const ret = ['t' + day.type];
    if (this.ss.session.year.day.dayOfWeek === day.dayOfWeek) {
      ret.push('active');
    }
    return ret;
  }

  clickWeekDay(day: DayData): void {
    this.ss.session.year.day = day;
  }

  clickPrevWeek(): void {
    this.ss.session.year.dayIdx -= 7;
  }

  clickNextWeek(): void {
    this.ss.session.year.dayIdx += 7;
  }
}
