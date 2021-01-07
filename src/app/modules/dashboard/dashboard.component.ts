import {Component} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {TimeData, TimeType} from '@/_models/time-data';
import {DialogResult, DialogResultButton} from '@/_models/dialog-data';
import {DayData} from '@/_models/day-data';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public dataIdx: number = null;

  constructor(public ss: SessionService,
              private router: Router) {
  }

  public get data(): TimeData {
    return this.ss.session.year.day.times[this.dataIdx];
  }

  get playData(): { text: string, icon: string } {
    const ret = {text: $localize`Kommen`, icon: 'domain'};
    if (this.data != null) {
      switch (this.data.type) {
        case TimeType.Arbeitszeit:
          return {text: $localize`Pause`, icon: 'pause'};
        case TimeType.Pause:
          return {text: $localize`Pause beenden`, icon: 'domain'};
      }
    }
    return ret;
  }

  clickPlay($event: MouseEvent): void {
    if (this.data == null) {
      this.ss.session.year.day.times.push(TimeData.factory());
      this.dataIdx = this.ss.session.year.day.times.length - 1;
    }
    if (this.data.start == null) {
      this.data.start = TimeData.now;
      this.data.type = TimeType.Arbeitszeit;
    } else {
      const prevType = this.data.type;
      this.data.end = TimeData.now;
      this.ss.session.year.day.times.push(TimeData.factory());
      this.dataIdx = this.ss.session.year.day.times.length - 1;
      this.data.start = TimeData.now;
      this.data.type = prevType === TimeType.Arbeitszeit ? TimeType.Pause : TimeType.Arbeitszeit;
    }
    this.ss.saveSession();
  }

  clickStop($event: MouseEvent): void {
    this.data.end = TimeData.now;
    this.dataIdx = null;
    this.ss.saveSession();
  }

  deleteTime($event, idx: number): void {
    $event.stopPropagation();
    this.ss.confirm($localize`${this.ss.session.year.day.times[idx].typeForDisplay} wirklich löschen?`).subscribe(
      (result: DialogResult) => {
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
    const ret = ['t' + this.ss.session.year.day.type];
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

    if (DayData.isToday(day)) {
      ret.push('today');
    }
    return ret;
  }

  clickWeekDay(day: DayData): void {
    this.ss.session.year.day = day;
    if (day.times.length > 0 && day.times[day.times.length - 1].end == null) {
      this.dataIdx = day.times.length - 1;
    }
  }

  clickPrevWeek(): void {
    this.ss.session.year.dayIdx -= 7;
  }

  clickNextWeek(): void {
    this.ss.session.year.dayIdx += 7;
  }

  clickCalendar(): void {
    this.ss.session.year.dayIdx = null;
    this.ss.saveSession();
    this.router.navigate(['calendar']);
  }
}
