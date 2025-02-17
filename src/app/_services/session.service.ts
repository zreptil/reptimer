import {Injectable} from '@angular/core';
import {SessionData} from '@/_models/session-data';

import {DialogData, DialogResult, DialogResultButton, DialogType, IDialogDef} from '@/_models/dialog-data';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '@/core/components/dialog/dialog.component';
import {Router} from '@angular/router';
import {AuthenticationService} from '@/_services/authentication.service';
import {AppBaseComponent} from '@/core/classes/app-base-component';
import {ControlObject} from '@/core/classes/ibase-component';
import {EnvironmentService} from '@/_services/environment.service';
import {BaseDBData} from '@/_models/base-data';
import {DataService} from '@/_services/data.service';
import {CEM} from '@/_models/cem';
import {YearData} from '@/_models/year-data';
import {StorageService} from '@/_services/storage.service';
import {ConfigData} from '@/_models/config-data';
import {UserData} from '@/_models/user-data';
import {catchError, map} from 'rxjs/operators';
import {EditChangeFn, EditData} from '@/_models/edit-data';

export declare type ServiceBarFn<T> = (self: AppBaseComponent) => T;

export class ServiceBarControl {
  label?: string;
  icon?: string;
  name?: string;
  position?: string;
  defKey?: string;
  disabled?: boolean | ServiceBarFn<boolean>;
  hidden?: boolean | ServiceBarFn<boolean>;

  method?: ServiceBarFn<void>;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  /**
   * Diese variable dient dazu, bestimmte Elemente in originellerer Art darzustellen.
   */
  public haveFun = false;
  // Vorgang Methods
  servicebar = [];
  servicebarInfo: string;
  // **********************************************************************
  servicebarSave: any;
  servicebarComponent: any;
  languageCode: string;
  /**
   * Die vordefinierten Inhalte der Servicebar.
   * Wenn die Servicebar in der Komponente definiert wird, muss diese
   * als static angelegt werden:
   * z.B.
   * servicebarDef: ServiceBarControl[] = [{defKey: 'next'}];
   */
  servicebarDefs: { [name: string]: ServiceBarControl[] } = {
    save: [{
      label: $localize`Speichern`,
      icon: 'save',
      position: 'center',
      method: (self: AppBaseComponent) => {
        self.cs.writeSessionData(self);
      }
    }],
    reset: [{
      label: $localize`Reset`,
      icon: 'refresh',
      position: 'center',
      method: (self: AppBaseComponent) => {
        self.sessionService.confirm($localize`Sollen alle Eingaben zurückgesetzt werden?`).subscribe(result => {
          if (result.btn === DialogResultButton.yes) {
            self.formDirective.resetForm();
            self.form.reset();
            self.cs.readSessionData(self);
          }
        });
      }
    }],
    navigation: [{defKey: 'prev'}, {defKey: 'next'}],
    workflow: [{defKey: 'prev'}, {defKey: 'save'}, {defKey: 'next'}]
  };
  public session: SessionData = new SessionData();
  titleToolbar: string;

  public afterSave: Observable<void>;
  public afterSaveSubject: BehaviorSubject<void>;

  constructor(private dialog: MatDialog,
              //              public ws: WorkflowService,
              private as: AuthenticationService,
              private ds: DataService,
              private storage: StorageService,
              private router: Router,
              public env: EnvironmentService
  ) {
    this.loadSession();
    this.languageCode = localStorage.getItem('language') || 'de-DE';
    this.afterSaveSubject = new BehaviorSubject<void>(null);
    this.afterSave = this.afterSaveSubject.asObservable();
  }

  public get calendar(): YearData {
    return this.session.year.data;
  }

  public set calendar(value) {
    const edit = this.session.year?.edit;
    this.session.year = EditData.factory();
    this.session.year.data = value;
    if (edit != null) {
      this.session.year.edit = edit;
      this.session.year.refresh();
    }
    this.saveSession();
  }

  get hasServicebar(): boolean {
    return this.servicebar.length > 0;
  }

  get edit(): EditData {
    return this.session.year;
  }

  _titleInfo: string;

  get titleInfo(): string {
    return this._titleInfo;
  }

  set titleInfo(value: string) {
    setTimeout(() => this._titleInfo = value, 1);
  }

  public get mayDebug(): boolean {
    return this.session.user?.may.debug ?? false;
  }

  public get isDebug(): boolean {
    return this.session.cfg.isDebug && (this.session.user?.may.debug ?? false);
  }

  addMonth(diff: number): void {
    const date = new Date(this.session.day.year, this.session.day.month + diff - 1, this.session.day.day);
    const dayIdx = this.calendar.days.findIndex(entry => {
      return entry.day === date.getDate() && entry.month - 1 === date.getMonth() && entry.year === date.getFullYear();
    });
    if (dayIdx >= 0) {
      this.session.dayIdx = dayIdx;
    } else if (date.getFullYear() !== this.session.cfg.year) {
      this.loadYear(date).subscribe(_year => {
        /*
        dayIdx = this.calendar.days.findIndex(entry => {
                return entry.day === date.getDate() && entry.month - 1 === date.getMonth() && entry.year === date.getFullYear();
        });
        if (dayIdx >= 0) {
          this.session.dayIdx = dayIdx;
        }
        */
      });
    }
  }

  public initDBData(_data: BaseDBData): void {
  }

  fireEditChange(): void {
    this.session.year.fireChange('');
  }

  watchEditData(method: EditChangeFn): void {
    this.session.year?.onChange('', method);
  }

  getEditData(path: string): any | null {
    const ret = this.session.year?.get(path);
    return ret?.data;
  }

  setEditData(path: string, key: string, id: number, data?: any): any {
    const ret = this.session.year?.add(path, key, id, data);
    this.storage.write(EditData.CEM, this.session.year, false);
    return ret;
  }

  /**
   * Remove data from editData.
   * @param keys list of keys that are removed from editData. If this parameter is null
   *             then all editData is cleared.
   */
  clearEditData(keys?: string | string[]): void {
    if (keys == null) {
      this.session.year = null;
    } else {
      this.session.year?.clear(keys);
    }
  }

  createYear(date: Date): void {
    this.calendar.year = date.getFullYear();
    this.saveConfig();
    this.loadSession();
    this.session.selectDate(date);
    return;
  }

  loadYear(date: Date): Observable<YearData> {
    return this.ds.get(CEM.Year, `year&year=${date.getFullYear()}`)
      .pipe(
        map(src => {
          if (!src || src === '') {
            this.createYear(date);
          }
          // console.log('loadYear', src);
          let year = YearData.factory();
          year.year = date.getFullYear();
          year.fillHolidays();
          if (src.days?.length > 0) {
            year = this.session.CEM.classify(src);
          }
          const session = new SessionData();
          session.user = this.session.user;
          session.cfg = new ConfigData();
          session.cfg.authorization = this.session.cfg.authorization;
          session.cfg.isDebug = this.session.cfg.isDebug;
          session.cfg.year = date.getFullYear();
          session.year = EditData.factory();
          session.year.data = year;
          session.selectDate(date);
          this.session = session;
          this.saveSession();
          return year;
        }),
        catchError(err => {
          this.createYear(date);
          throw new Error('error in source. Details: ' + err);
        }));
  }

  setUser(user: UserData): void {
    this.session.user = user ?? UserData.factory();
    // console.log('user', this.session.user);
    if (!this.session.user.isAuthorized) {
      this.session.cfg.authorization = null;
      this.saveSession();
    } else {
      const date = new Date(this.session.cfg.year, 0, this.session.dayIdx);
      this.loadYear(date).subscribe(_year => {
        this.session.selectDate(new Date());
      });
    }
  }

  // **********************************************************************
  // Sessiondata Methods
  // **********************************************************************
  loadSession(): void {
    this.session.user = UserData.factory();
    this.session.cfg = this.storage.read(CEM.Config);
    if (this.session.cfg == null) {
      this.session.cfg = ConfigData.factory();
      this.session.cfg.authorization = '';
    }
    this.calendar = this.storage.read(this.session.CEM);
    // console.log(this.session.CEM, this.session.year);
    if (this.calendar?.days == null) {
      this.titleInfo = $localize`Lade Daten...`;
      this.session.year.data = YearData.factory();
      // this.saveSession();
    }
    let dst = 'calendar';
    if (this.session.day != null) {
      dst = 'dashboard';
      let date = new Date();
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (+this.session.year.data.year === date.getFullYear()) {
        this.session.selectDate(date);
      }
    }
    this.router.navigate([dst]);
  }

  saveConfig(): void {
    if (this.calendar?.year) {
      this.session.cfg.year = this.calendar?.year;
      this.storage.write(CEM.Config, this.session.cfg, false);
    }
  }

  saveSession(): void {
    this.saveConfig();
    // console.log('saveSession', this.session.year);
    this.storage.write(this.session.CEM, this.calendar, false);
    if (this.session.user.isAuthorized) {
      const list = [];
      for (const day of this.calendar.days) {
        list.push(day.toJson());
      }
      const data = {year: this.calendar.year, days: list};
      this.ds.update(CEM.Year, data).subscribe(result => {
        this.session.year.data = this.session.CEM.classify(result);
      }, error => {
        console.log(error);
        this.debug(error);
      });
    }
    this.afterSaveSubject?.next();
  }

  // **********************************************************************
  // ServiceBar Methods
  // **********************************************************************
  public resetServicebar(): void {
    this.servicebar = [];
    this.extractServicebar(this.servicebarSave);
    this.servicebarComponent.transferServicebarControls();
  }

  public extractServicebar(servicebar: any, method?: any): void {
    this.servicebarSave = servicebar;
    for (const entry of servicebar) {
      if (entry.defKey) {
        this.extractServicebar(this.servicebarDefs[entry.defKey], entry.method);
      } else {
        const text = entry.label;
        const ctrl = {
          label: text,
          icon: entry.icon,
          name: entry.name,
          position: entry.position || 'left',
          disabled: entry.disabled,
          hidden: entry.hidden,
          method: method ? method : entry.method,
          defKey: entry.defKey
        };
        this.servicebar.push(ctrl);
      }
    }
  }

  showIllegalWorkflow(): void {
    this.showDialog(DialogType.info,
      this.haveFun ? $localize`Albernes Herumgehüpfe im Workflow wird es hier nicht geben!`
        : $localize`Der Workflow Schritt konnte nicht gefunden werden.`);
  }

  // **********************************************************************
  // Dialog Methods
  // **********************************************************************
  debug(content: string | string[] | ControlObject,
        prodContent?: string | string[] | ControlObject): Observable<DialogResult> {
    let type = DialogType.debug;
    if (this.env.isProduction) {
      if (prodContent) {
        content = prodContent;
        type = DialogType.info;
      } else {
        return of({btn: DialogResultButton.ok});
      }
    }
    return this.showDialog(type, content);
  }

  info(content: string | string[] | ControlObject): Observable<DialogResult> {
    return this.showDialog(DialogType.info, content);
  }

  confirm(content: string | string[] | ControlObject): Observable<DialogResult> {
    return this.showDialog(DialogType.confirm, content);
  }

  showDialog(type: DialogType | IDialogDef, content: string | string[] | ControlObject): Observable<DialogResult> {
    const dlgRef = this.dialog.open(DialogComponent, {
      data: new DialogData(type, content)
    });
    dlgRef.keydownEvents().subscribe(event => {
      if (event.code === 'Escape') {
        dlgRef.close({btn: DialogResultButton.abort});
      }
    });
    dlgRef.backdropClick().subscribe(_event => {
      dlgRef.close({btn: DialogResultButton.abort});
    });
    return dlgRef.afterClosed();
  }

  // **********************************************************************
  // Ungrouped Methods
  // **********************************************************************
  languageImgCode(value: string): string {
    return value?.length >= 2
      ? value.substr(value.length - 2, 2).toLowerCase()
      : 'de';
  }

  onOutletAction(_$event: any): any {
  }
}
