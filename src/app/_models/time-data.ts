import {BaseDBData} from '@/_models/base-data';

export class TimeData extends BaseDBData {
  xmlCfg = {
    className: 'TimeData'
  };

  start: number = null;
  end: number = null;

  static factory(): TimeData {
    const ret = new TimeData();
    return ret;
  }

  create(): TimeData {
    return TimeData.factory();
  }

}
