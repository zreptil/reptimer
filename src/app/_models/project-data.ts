import {BaseDBData} from '@/_models/base-data';
import {TimeData} from '@/_models/time-data';

export class ProjectData extends BaseDBData {
  xmlCfg = {
    className: 'ProjectData'
  };

  times: TimeData[] = [];

  static factory(): ProjectData {
    const ret = new ProjectData();
    return ret;
  }

  create(): ProjectData {
    return ProjectData.factory();
  }

}
