import {BaseDBData} from '@/_models/base-data';

enum TimeType {
  Arbeitszeit,

}

export class TimeData extends BaseDBData {
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
