import {BaseDBData} from '@/_models/base-data';
import {ClassEPMap} from '@/_models/class-epmap';
import {TimeData} from '@/_models/time-data';

export class ProjectData extends BaseDBData {
  static CEM = new ClassEPMap<ProjectData>('day', ProjectData.factory);
  xmlCfg = {
    className: 'ProjectData'
  };

  name: string = null;
  duration: number = null;
  info: string = null;

  get durationDisplay(): string {
    return TimeData.timeForDisplay(this.duration);
  }

  static factory(): ProjectData {
    const ret = new ProjectData();
    return ret;
  }

  create(): ProjectData {
    return ProjectData.factory();
  }

}
