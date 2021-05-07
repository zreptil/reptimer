import {BaseDBData} from '@/_models/base-data';
import {DayData, DayType} from '@/_models/day-data';
import {TimeData} from '@/_models/time-data';

export class YearData extends BaseDBData {
  xmlCfg = {
    className: 'YearData'
  };

  year: number = null;
  days: DayData[] = [];
  daysARR = DayData.CEM;

  private constructor() {
    super();
  }

  static factory(): YearData {
    const ret = new YearData();
    ret.year = new Date(Date.now()).getFullYear();
    ret.fillHolidays();
    return ret;
  }

  public static monthName(month: number): string {
    const names = [$localize`Januar`, $localize`Februar`, $localize`März`,
      $localize`April`, $localize`Mai`, $localize`Juni`,
      $localize`Juli`, $localize`August`, $localize`September`,
      $localize`Oktober`, $localize`November`, $localize`Dezember`];

    return month >= 1 && month < 13 ? names[month - 1] : $localize`???`;
  }

  public static weekdayName(dayOfWeek: number, short: boolean = false): string {
    const longNames = [$localize`Montag`, $localize`Dienstag`,
      $localize`Mittwoch`, $localize`Donnerstag`,
      $localize`Freitag`, $localize`Samstag`, $localize`Sonntag`];
    const shortNames = [$localize`Mo`, $localize`Di`, $localize`Mi`,
      $localize`Do`, $localize`Fr`, $localize`Sa`, $localize`So`];

    const names = short ? shortNames : longNames;

    return dayOfWeek >= 0 && dayOfWeek < 7 ? names[dayOfWeek] : $localize`??`;
  }

  private static calcEasterSunday(date: Date): void {
    const g = date.getFullYear() % 19;
    const c = Math.floor(date.getFullYear() / 100);
    const h = (c - Math.floor(c / 4) - Math.floor((8 * c + 13) / 25) + 19 * g + 15) % 30;
    const i = h - Math.floor(h / 28) * (1 - Math.floor(29 / (h + 1) * Math.floor((21 - g) / 11)));
    const j = (date.getFullYear() + Math.floor(date.getFullYear() / 4) + i + 2 - c + Math.floor(c / 4)) % 7;
    const l = i - j;

    if (l <= 3) {
      date.setMonth(2);
      date.setDate(l + 28);
    } else {
      date.setMonth(3);
      date.setDate(l - 3);
    }
  }

  weekDayNameLong(day: number | DayData): string {
    if (typeof day !== 'number') {
      day = DayData.dayOfWeek(new Date(day.date));
    }
    return YearData.weekdayName(day, false);
  }

  weekDayNameShort(day: number | DayData): string {
    if (typeof day !== 'number') {
      day = DayData.dayOfWeek(new Date(day.date));
    }
    return YearData.weekdayName(day, true);
  }

  create(): YearData {
    return YearData.factory();
  }

  fillHolidays(): void {
    const times = [];
    const saved = [];
    if (this.days && this.days.length > 0) {
      for (const d of this.days) {
        switch (d.type) {
          case DayType.Krank:
          case DayType.Teilzeitfrei:
          case DayType.Urlaub:
          case DayType.UrlaubHalb:
            saved.push(d);
            break;
        }
        for (const time of d.times) {
          times.push({date: d.date, time});
        }
      }
    }

    this.days = [];
    const day = new Date(this.year, 0, 1);

    // fill array with every day of the year
    do {
      const data = new DayData();
      data.date = day.getTime();
      if (data.dayOfWeek === 5 || data.dayOfWeek === 6) {
        data.type = DayType.Frei;
      }
      this.days.push(data);
      day.setDate(day.getDate() + 1);
    } while (day.getFullYear() === +this.year);

    // add information to days
    const hd = new Date(this.year, 10, 27);
    hd.setDate(hd.getDate() + (6 - DayData.dayOfWeek(hd)));
    this.addHoliday(hd, $localize`-1. Advent`);
    hd.setDate(hd.getDate() + 7);
    this.addHoliday(hd, $localize`-2. Advent`);
    hd.setDate(hd.getDate() + 7);
    this.addHoliday(hd, $localize`-3. Advent`);
    hd.setDate(hd.getDate() + 7);
    this.addHoliday(hd, $localize`-4. Advent`);
    hd.setDate(hd.getDate() - 28);
    this.addHoliday(hd, $localize`-Toten&shy;sonntag`);
    hd.setDate(hd.getDate() - 7);
    this.addHoliday(hd, $localize`-Volks&shy;trauertag`);
    hd.setDate(1);
    hd.setMonth(4);
    hd.setDate(14 - DayData.dayOfWeek(hd));
    this.addHoliday(hd, $localize`-Muttertag`);
    YearData.calcEasterSunday(hd);
    this.addHoliday(hd, $localize`-Oster&shy;sonntag`);
    hd.setDate(hd.getDate() - 46);
    this.addHoliday(hd, $localize`-Ascher&shy;mittwoch`);
    hd.setDate(hd.getDate() + 44);
    this.addHoliday(hd, $localize`Karfreitag`);
    hd.setDate(hd.getDate() + 3);
    this.addHoliday(hd, $localize`Oster&shy;montag`);
    hd.setDate(hd.getDate() + 38);
    this.addHoliday(hd, $localize`Vatertag / Christi Himmelfahrt`);
    hd.setDate(hd.getDate() + 11);
    this.addHoliday(hd, $localize`Pfingst&shy;montag`);
    hd.setDate(hd.getDate() - 1);
    this.addHoliday(hd, $localize`-Pfingst&shy;sonntag`);
    hd.setDate(hd.getDate() + 11);
    this.addHoliday(hd, $localize`Fron&shy;leichnam`);

    this.addHoliday(new Date(this.year, 0, 1), `Neujahr`);
    this.addHoliday(new Date(this.year, 0, 6), `Heilige Drei Könige`);
    this.addHoliday(new Date(this.year, 4, 1), `Maifeiertag`);
    this.addHoliday(new Date(this.year, 7, 8), `Friedensfest (Augsburg)`);
    this.addHoliday(new Date(this.year, 7, 15), `Mariä Himmelfahrt`);
    this.addHoliday(new Date(this.year, 9, 3), `Tag der deutschen Einheit`);
    this.addHoliday(new Date(this.year, 10, 1), `Aller&shy;hei&shy;ligen`);
    this.addHoliday(new Date(this.year, 11, 25), `1. Weih&shy;nachts&shy;feier&shy;tag`);
    this.addHoliday(new Date(this.year, 11, 26), `2. Weih&shy;nachts&shy;feier&shy;tag`);

    // console.log('adding times', times);
    for (const time of times) {
      this.addTime(time.date, time.time);
    }

    // console.log('adding daytypes', saved);
    for (const s of saved) {
      const d = this.days.find((entry) => entry.date === s.date);
      if (d != null) {
        d.type = s.type;
      }
    }

    // console.log(this.days);
  }

  private addTime(date: number, time: any): void {
    const day = this.days.find((entry) => entry.date === date);
    if (day != null) {
      day.times.push(TimeData.CEM.classify(time));
    }
  }

  private addHoliday(date: Date, info: string): void {
    const day = this.days.find((entry) => entry.date === date.getTime());
    if (day != null) {
      if (info.startsWith('-')) {
        day.info = info.substring(1);
        day.type = DayType.Info;
      } else {
        day.info = info;
        day.type = DayType.Feiertag;
      }
    }
  }

}
