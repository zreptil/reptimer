import {BaseDBData} from '@/_models/base-data';
import {TimeData} from '@/_models/time-data';
import {ClassEPMap} from '@/_models/class-epmap';

export enum DayType {
  Arbeitstag = null,
  Urlaub = 1,
  UrlaubHalb,
  Teilzeitfrei,
  Feiertag,
  Krank,
  Info,
  Frei
}

export class DayData extends BaseDBData {
  static CEM = new ClassEPMap<DayData>('day', DayData.factory);
  static typeList = [
    {id: DayType.Arbeitstag, label: $localize`Arbeitstag`},
    {id: DayType.Frei, label: $localize`Frei`},
    {id: DayType.Urlaub, label: $localize`Urlaub`},
    {id: DayType.UrlaubHalb, label: $localize`Urlaub 1/2`},
    {id: DayType.Teilzeitfrei, label: $localize`Teilzeitfrei`},
    {id: DayType.Feiertag, label: $localize`Feiertag`},
    {id: DayType.Krank, label: $localize`Krank`},
    {id: DayType.Info, label: $localize`Info`}
  ];
  xmlCfg = {
    className: 'DayData'
  };
  date: number = null;
  type: DayType = null;
  info: string = null;
  times: TimeData[] = [];
  timesARR = TimeData.CEM;

  get display(): string {
    let ret = `${this.day}`;
    if (this.times.length > 0) {
      ret = `[${ret}]`;
    }
    return ret;
  }

  get isValid(): boolean {
    return this.date != null;
  }

  get month(): number {
    return new Date(this.date).getMonth() + 1;
  }

  get day(): number {
    return new Date(this.date).getDate();
  }

  get year(): number {
    return new Date(this.date).getFullYear();
  }

  get week(): number {
    const date = new Date(this.date);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  get dayOfWeek(): number {
    return DayData.dayOfWeek(new Date(this.date));
  }

  get dateString(): string {
    const date = new Date(this.date);
    return date.toLocaleDateString();
  }

  static dayOfWeek(date: Date): number {
    if (date === undefined) {
      return 1;
    }
    const ret = date.getDay() - 1;
    return ret >= 0 ? ret : 6;
  }

  static factory(): DayData {
    const ret = new DayData();
    return ret;
  }

  static isToday(day: DayData): boolean {
    const today = new Date(Date.now());
    return today.getDate() === day.day && today.getMonth() === day.month - 1 && today.getFullYear() === day.year;
  }

  isSameDay(check: DayData): boolean {
    return this.day === check.day && this.month === check.month && this.year === check.year;
  }

  create(): DayData {
    return DayData.factory();
  }
}
