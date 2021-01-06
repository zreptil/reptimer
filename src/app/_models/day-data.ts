import {BaseDBData} from '@/_models/base-data';
import {TimeData} from '@/_models/time-data';
import {ClassEPMap} from '@/_models/class-epmap';

export enum DayType {
  Arbeitstag,
  Urlaub,
  UrlaubHalb,
  Teilzeitfrei,
  Feiertag,
  Krank,
  Info
}

export class DayData extends BaseDBData {
  static CEM = new ClassEPMap<DayData>('day', DayData.factory);
  xmlCfg = {
    className: 'DayData'
  };

  date: number = null;
  type: DayType = null;
  info: string = null;
  times: TimeData[] = [];
  timesARR = TimeData.CEM;

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

  dateString(): string {
    const date = new Date(this.date);
    return date.toString();
  }

  create(): DayData {
    return DayData.factory();
  }

}
