import {BaseDBData} from '@/_models/base-data';
import {ClassEPMap} from '@/_models/class-epmap';

enum TimeType {
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

  static factory(): TimeData {
    const ret = new TimeData();
    return ret;
  }

  create(): TimeData {
    return TimeData.factory();
  }

}
