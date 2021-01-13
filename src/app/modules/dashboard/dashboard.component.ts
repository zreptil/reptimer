import {saveAs} from 'file-saver';
import {Component} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {TimeData, TimeType} from '@/_models/time-data';
import {DialogResult, DialogResultButton} from '@/_models/dialog-data';
import {DayData, DayType} from '@/_models/day-data';
import {Router} from '@angular/router';
import {CEM} from '@/_models/cem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public dataIdx: number = null;
  triggerUpdate = false;
  importFile: string;

  constructor(public ss: SessionService,
              private router: Router) {
    this.updateTitle();
    ss.afterSave.subscribe(_ => this.updateSession());
  }

  public get dayTypeList(): any[] {
    return DayData.typeList;
  }

  public get data(): TimeData {
    return this.ss.session.day.times[this.dataIdx];
  }

  get playData(): { text: string, icon: string } {
    const ret = {text: $localize`Kommen`, icon: 'play_arrow'};
    if (this.data != null) {
      switch (this.data.type) {
        case TimeType.Arbeitszeit:
          return {text: $localize`Pause`, icon: 'pause'};
        case TimeType.Pause:
          return {text: $localize`Pause beenden`, icon: 'play_arrow'};
      }
    }
    return ret;
  }

  updateTitle(): void {
  }

  updateSession(): void {
    this.triggerUpdate = !this.triggerUpdate;
    this.updateTitle();
  }

  clickPlay($event: MouseEvent): void {
    if (this.data == null) {
      this.ss.session.day.times.push(TimeData.factory());
      this.dataIdx = this.ss.session.day.times.length - 1;
    }
    if (this.data.start == null) {
      this.data.start = TimeData.now;
      this.data.type = TimeType.Arbeitszeit;
    } else {
      const prevType = this.data.type;
      this.data.end = TimeData.now;
      this.ss.session.day.times.push(TimeData.factory());
      this.dataIdx = this.ss.session.day.times.length - 1;
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
    this.ss.confirm($localize`${this.ss.session.day.times[idx].typeForDisplay} wirklich löschen?`).subscribe(
      (result: DialogResult) => {
        switch (result.btn) {
          case DialogResultButton.yes:
            this.ss.session.day.times.splice(idx, 1);
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
    const ret = ['t' + this.ss.session.day.type];
    if (this.dataIdx === idx) {
      ret.push('active');
    }
    return ret;
  }

  typeClass(type: DayType): string[] {
    const ret = ['t' + type];
    if (this.ss.session.day.type === type) {
      ret.push('active');
    }
    return ret;
  }

  weekClass(day: DayData): string[] {
    const ret = ['t' + day.type];
    if (this.ss.session.day.dayOfWeek === day.dayOfWeek) {
      ret.push('active');
    }

    if (DayData.isToday(day)) {
      ret.push('today');
    }
    return ret;
  }

  clickWeekDay(day: DayData): void {
    this.ss.session.day = day;
    if (day.times.length > 0 && day.times[day.times.length - 1].end == null) {
      this.dataIdx = day.times.length - 1;
    }
    this.updateTitle();
  }

  clickPrevWeek(): void {
    this.ss.session.dayIdx -= 7;
    this.updateTitle();
  }

  clickNextWeek(): void {
    this.ss.session.dayIdx += 7;
    this.updateTitle();
  }

  clickDayType(type: DayType): void {
    this.ss.session.day.type = type;
    this.ss.saveSession();
    this.updateTitle();
  }

  clickRefresh(): void {
    this.ss.confirm($localize`Hiermit werden die Feiertage und Wochenenden des Jahres erneut befüllt. Die Zeiten bleiben erhalten, aber die Arten der Tage, die nicht als Urlaub, Krank oder Teilzeitfrei definiert wurden, werden zurückgesetzt. Soll das ausgeführt werden?`).subscribe(result => {
      switch (result.btn) {
        case DialogResultButton.yes:
          this.ss.calendar.fillHolidays();
          this.ss.saveSession();
          break;
      }
    });
  }

  clickExport(): void {
    const blob = new Blob([this.ss.session.year.asString], {type: 'application/json'});
    const date = new Date();
    const timestamp = date.getTime();
    const fileName = 'reptimer-' + timestamp + '.json';
    saveAs(blob, fileName);
  }

  clickImport(): void {
    const elem = (document.querySelector('#importData') as HTMLInputElement);
    elem.value = '';
    elem.click();
  }

  async handleImport($event): Promise<void> {
    const blob = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onloadend = (e) => {
      const text = reader.result;
      if (typeof text === 'string') {
        this.ss.session.year = CEM.YearStorage.classify(JSON.parse(text));
        console.log('year', this.ss.session.year);
        this.ss.saveSession();
      }
    };
  }
}
