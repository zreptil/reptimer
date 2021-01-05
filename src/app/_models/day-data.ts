import {BaseDBData} from '@/_models/base-data';
import {TimeData} from '@/_models/time-data';

enum DayType {
  Arbeitstag,
  Urlaub,
  UrlaubHalb,
  Teilzeitfrei,
  Feiertag,
  Krank
}

export class DayData extends BaseDBData {
  xmlCfg = {
    className: 'DayData'
  };

  date: number = null;
  type: DayType = null;
  info: string = null;
  times: TimeData[] = [];

  static factory(): DayData {
    const ret = new DayData();
    return ret;
  }

  create(): DayData {
    return DayData.factory();
  }

}
