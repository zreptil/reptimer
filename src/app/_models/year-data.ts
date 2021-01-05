import {BaseDBData} from '@/_models/base-data';
import {DayData, DayType} from '@/_models/day-data';

export class YearData extends BaseDBData {
  xmlCfg = {
    className: 'YearData'
  };

  year: number;
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

  private static dayOfWeek(date: Date): number {
    if (date === undefined) {
      return 1;
    }
    const ret = date.getDay() - 1;
    return ret >= 0 ? ret : 6;
  }

  create(): YearData {
    return YearData.factory();
  }

  fillHolidays(): void {
    this.days = [];
    const day = new Date(this.year, 0, 1);

    // fill array with every day of the year
    do {
      const data = new DayData();
      data.date = day.getTime();
      this.days.push(data);
      day.setDate(day.getDate() + 1);
    } while (day.getFullYear() === this.year);

    // add information to days
    const hd = new Date(this.year, 10, 27);
    hd.setDate(hd.getDate() + (6 - YearData.dayOfWeek(hd)));
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
    hd.setDate(14 - YearData.dayOfWeek(hd));
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
    this.addHoliday(new Date(this.year, 10, 1), `Allerheiligen`);
    this.addHoliday(new Date(this.year, 11, 25), `1. Weihnachtsfeiertag`);
    this.addHoliday(new Date(this.year, 11, 26), `2. Weihnachtsfeiertag`);
  }

  private addHoliday(date: Date, info: string): void {
    const day = this.days.find((entry) => entry.date === date.getTime());
    if (day != null) {
      day.info = info;
      day.type = DayType.Feiertag;
    }
  }

}
