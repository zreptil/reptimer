import {BaseDBData} from '@/_models/base-data';
import {ProjectData} from '@/_models/project-data';

export class DayData extends BaseDBData {
  xmlCfg = {
    className: 'DayData'
  };

  projects: ProjectData[] = [];

  static factory(): DayData {
    const ret = new DayData();
    return ret;
  }

  create(): DayData {
    return DayData.factory();
  }

}
