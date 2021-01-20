import {ConfigData} from '@/_models/config-data';
import {UserData} from '@/_models/user-data';
import {DayData} from '@/_models/day-data';
import {TimeData} from '@/_models/time-data';
import {ProjectData} from '@/_models/project-data';
import {EditData} from '@/_models/edit-data';
import {ClassEPMap} from '@/_models/class-epmap';
import {YearData} from '@/_models/year-data';

export class SessionData {
  year: EditData = null;
  cfg: ConfigData = null;
  user: UserData = null;
  editTime: TimeData = null;
  editProject: ProjectData = null;

  get CEM(): ClassEPMap<YearData> {
    return new ClassEPMap<YearData>(`year${this.cfg.year}`, YearData.factory);
  }


  get dayIdx(): number {
    return this.cfg._dayIdx;
  }

  set dayIdx(value: number) {
    if (value == null) {
      value = 0;
    }
    if (value >= this.year.data.days.length) {
      value = this.year.data.days.length - 1;
    }
    if (value < 0) {
      value = 0;
    }
    this.cfg._dayIdx = value;
  }

  get day(): DayData {
    return this.year.data.days[this.dayIdx] ?? DayData.factory();
  }

  set day(value: DayData) {
    this.dayIdx = this.year.data.days.findIndex(entry => {
      return entry.day === value.day && entry.month === value.month && entry.year === value.year;
    });
  }

  get week(): DayData[] {
    return this.year.data.days.filter(day => {
      return day.week === this.day.week;
    });
  }
}
