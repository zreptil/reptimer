import {BaseDBData} from '@/_models/base-data';
import {ClassEPMap} from '@/_models/class-epmap';

export enum TimeType {
  Arbeitszeit,
  Pause
}

export class TimeData extends BaseDBData {
  static CEM = new ClassEPMap<TimeData>('day', TimeData.factory);
  xmlCfg = {
    className: 'TimeData'
  };

  start: number = null;
  end: number = null;
  info: string = null;
  type: TimeType = null;

  static get now(): number {
    return TimeData.timeFromDate(new Date(Date.now()));
  }

  get typeForDisplay(): string {
    switch (this.type) {
      case TimeType.Arbeitszeit:
        return $localize`Arbeitszeit`;
      case TimeType.Pause:
        return $localize`Pause`;
    }
    return $localize`unbekannt`;
  }

  get fromValue(): string {
    return this.from;
  }

  set fromValue(value: string) {
    const parts = value.split(':');
    if (parts.length === 2) {
      this.start = +(+parts[0] * 60 + +parts[1]);
    }
  }

  get toValue(): string {
    return this.to;
  }

  set toValue(value: string) {
    const parts = value.split(':');
    if (parts.length === 2) {
      this.end = +(+parts[0] * 60 + +parts[1]);
    }
  }

  get from(): string {
    return TimeData.timeForDisplay(this.start);
  }

  get to(): string {
    return TimeData.timeForDisplay(this.end);
  }

  static timeFromDate(value: Date): number {
    return value.getHours() * 60 + value.getMinutes();
  }

  static timeForDisplay(value: number): string {
    if (value == null) {
      return '';
    }
    const h = Math.floor(value / 60);
    const m = value % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  }

  static factory(): TimeData {
    const ret = new TimeData();
    return ret;
  }

  create(): TimeData {
    return TimeData.factory();
  }

}
