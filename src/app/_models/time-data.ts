import {BaseDBData} from '@/_models/base-data';
import {ClassEPMap} from '@/_models/class-epmap';

export enum TimeType {
  Arbeitszeit,

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

  get typeForDisplay(): string {
    switch (this.type) {
      case TimeType.Arbeitszeit:
        return $localize`Arbeitszeit`;
    }
    return $localize`unbekannt`;
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
    return `${h}:${m}`;
  }

  static factory(): TimeData {
    const ret = new TimeData();
    return ret;
  }

  create(): TimeData {
    return TimeData.factory();
  }

}
