import {BaseDBData} from '@/_models/base-data';
import {ClassEPMap} from '@/_models/class-epmap';
import {TimeUtils} from '@/_models/time-utils';

export class ProjectData extends BaseDBData {
  static CEM = new ClassEPMap<ProjectData>('day', ProjectData.factory);
  xmlCfg = {
    className: 'ProjectData'
  };

  name: string = null;
  duration: number = null;
  info: string = null;

  get durationDisplay(): string {
    return TimeUtils.timeForDisplay(this.duration);
  }

  static factory(): ProjectData {
    const ret = new ProjectData();
    return ret;
  }

  create(): ProjectData {
    return ProjectData.factory();
  }

}
