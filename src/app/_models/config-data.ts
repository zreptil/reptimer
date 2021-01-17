import {BaseDBData} from '@/_models/base-data';

export class ConfigData extends BaseDBData {
  authorization = '';
  isDebug = false;
  year: number = null;
  xmlCfg = {
    className: 'ConfigData'
  };

  _dayIdx = 0;

  static factory(): ConfigData {
    const ret = new ConfigData();
    ret.authorization = '';
    ret.isDebug = false;
    ret._dayIdx = 0;
    ret.year = new Date(Date.now()).getFullYear();
    return ret;
  }

  create(): ConfigData {
    return ConfigData.factory();
  }
}
