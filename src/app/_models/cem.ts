// Einige Definitionen wurden in die Datenklassen verlagert, um zirkuläre
// Referenzen zu vermeiden.
import {ClassEPMap} from '@/_models/class-epmap';
import {YearData} from '@/_models/year-data';
import {DayData} from '@/_models/day-data';
import {TimeData} from '@/_models/time-data';

export const CEM = {
  Time: TimeData.CEM,
  Day: DayData.CEM,
  Year: new ClassEPMap<YearData>('year', YearData.factory),
};
