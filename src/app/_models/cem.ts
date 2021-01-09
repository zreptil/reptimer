// Einige Definitionen wurden in die Datenklassen verlagert, um zirkuläre
// Referenzen zu vermeiden.
import {ClassEPMap} from '@/_models/class-epmap';
import {YearData} from '@/_models/year-data';
import {DayData} from '@/_models/day-data';
import {TimeData} from '@/_models/time-data';
import {UserData} from '@/_models/user-data';
import {AdminUserData} from '@/_models/admin-user-data';
import {ConfigData} from '@/_models/config-data';

export const CEM = {
  Time: TimeData.CEM,
  Day: DayData.CEM,
  Config: new ClassEPMap<ConfigData>('cfg', ConfigData.factory),
  Year: new ClassEPMap<any>('db.php'),
  YearStorage: new ClassEPMap<YearData>('year', YearData.factory),
  User: new ClassEPMap<UserData>('db.php', UserData.factory),
  AdminUser: new ClassEPMap<AdminUserData>('admin.php'),
  Login: new ClassEPMap<any>('login.php'),
};
