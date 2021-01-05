import {BaseDBData} from '@/_models/base-data';
import {DayData} from '@/_models/day-data';

export class YearData extends BaseDBData {
  xmlCfg = {
    className: 'YearData'
  };

  days: DayData[] = [];

  static factory(): YearData {
    const ret = new YearData();
    return ret;
  }

  fill(year: number): void {
    this.days = [];
    const day = new Date(year, 0, 1);
    while (day.getFullYear() === year) {
      console.log(day);
      day.setDate(day.getDate() + 1);
    }
  }

  create(): YearData {
    return YearData.factory();
  }

}
