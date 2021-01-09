import {UserData} from '@/_models/user-data';
import {BaseDBData} from '@/_models/base-data';
import {DayData} from '@/_models/day-data';

export class ConfigData extends BaseDBData {
  authorization = '';
  isDebug = false;
  xmlCfg = {
    className: 'ConfigData'
  };

  _dayIdx: number = null;

  static factory(): ConfigData {
    const ret = new ConfigData();
    ret.authorization = '';
    ret.isDebug = false;
    return ret;
  }

  create(): ConfigData {
    return ConfigData.factory();
  }
}
