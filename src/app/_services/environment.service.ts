import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {version} from '@environments/version';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public isProduction: boolean;
  public apiUrl: string;
  public buildInfo: string;
  public dbAdminUrl: string;

  constructor() {
    const dp = new DatePipe('de-DE');
    let date = dp.transform(new Date(version.date), 'mediumDate');
    date += ', ' + dp.transform(new Date(version.date), 'shortTime');
    this.buildInfo = environment.infoFmt.replace(/\\n|@date|@version/g, m => {
      return {'\\n': '\n', '@date': date, '@version': version.number}[m];
    });
    this.isProduction = environment.production;
    this.apiUrl = environment.apiUrl;
    if (!this.apiUrl.endsWith('/')) {
      this.apiUrl += '/';
    }
    this.dbAdminUrl = environment.dbAdminUrl;
  }
}
