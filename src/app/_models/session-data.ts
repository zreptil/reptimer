import {YearData} from '@/_models/year-data';
import {ConfigData} from '@/_models/config-data';
import {UserData} from '@/_models/user-data';
import {DayData} from '@/_models/day-data';
import {CEM} from '@/_models/cem';

export class SessionData {
  year: YearData = YearData.factory();
  cfg: ConfigData = null;
  user: UserData = null;

  get dayIdx(): number {
    return this.cfg._dayIdx;
  }

  set dayIdx(value: number) {
    if (value == null) {
      value = 0;
    }
    if (value >= this.year.days.length) {
      value = this.year.days.length - 1;
    }
    if (value < 0) {
      value = 0;
    }
    this.cfg._dayIdx = value;
  }

  get day(): DayData {
    return this.year.days[this.dayIdx] ?? DayData.factory();
  }

  set day(value: DayData) {
    this.dayIdx = this.year.days.findIndex(entry => {
      return entry.day === value.day && entry.month === value.month && entry.year === value.year;
    });
  }

  get week(): DayData[] {
    return this.year.days.filter(day => {
      return day.week === this.day.week;
    });
  }


  addMonth(diff: number): void {
    const date = new Date(this.day.year, this.day.month + diff - 1, this.day.day);
    const dayIdx = this.year.days.findIndex(entry => {
      return entry.day === date.getDate() && entry.month - 1 === date.getMonth() && entry.year === date.getFullYear();
    });
    if (dayIdx >= 0) {
      this.dayIdx = dayIdx;
    }
  }
}
