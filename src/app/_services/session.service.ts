import {Injectable} from '@angular/core';
import {SessionData} from '@/_models/session-data';

import {DialogData, DialogResult, DialogResultButton, DialogType, IDialogDef} from '@/_models/dialog-data';
import {Observable, of} from 'rxjs';
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

export declare type ServiceBarFn<T> = (self: AppBaseComponent) => T;

export class ServiceBarControl {
  label?: string;
  icon?: string;
  name?: string;
  position?: string;
  defKey?: string;
  disabled?: boolean | ServiceBarFn<boolean>;
  hidden?: boolean | ServiceBarFn<boolean>;

  method?: ServiceBarFn<any>;
//  method?(self: any): any;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  /**
   * Diese variable dient dazu, bestimmte Elemente in originellerer Art darzustellen.
   */
  public haveFun = false;
  // Vorgang Methods
  servicebar = [];
  // **********************************************************************
  servicebarSave: any;
  servicebarComponent: any;
  currentComponent: AppBaseComponent;
  languageCode: string;
  /**
   * Die vordefinierten Inhalte der Servicebar.
   * Wenn die Servicebar in der Komponente definiert wird, muss diese
   * als static angelegt werden:
   * z.B.
   * static servicebar: ServiceBarControl[] = [{defKey: 'next'}];
   */
  servicebarDefs = new Map<string, Array<ServiceBarControl>>([
    ['save', [{
      label: $localize`Speichern`,
      icon: 'save',
      position: 'center',
      method: (self: any) => {
        self.cs.writeSessionData(self);
      }
    }]],
    ['reset', [{
      label: $localize`Reset`,
      icon: 'refresh',
      position: 'center',
      method: (self: any) => {
        self.sessionService.confirm($localize`Sollen alle Eingaben zurückgesetzt werden?`).subscribe(result => {
          if (result.btn === DialogResultButton.yes) {
            self.formDirective.resetForm();
            self.form.reset();
            self.cs.readSessionData(self);
          }
        });
      }
    }]],
    ['navigation', [{defKey: 'prev'}, {defKey: 'next'}]],
  ]);
  public session: SessionData = new SessionData();
  titleToolbar: string;

  constructor(private dialog: MatDialog,
              private as: AuthenticationService,
              private ds: DataService,
              private storage: StorageService,
              private router: Router,
              public env: EnvironmentService
  ) {
    this.loadSession();
    this.languageCode = localStorage.getItem('language') || 'de-DE';
  }

  public get calendar(): YearData {
    return this.session.year;
  }

  get hasServicebar(): boolean {
    return this.servicebar.length > 0;
  }

  _titleInfo: string;

  get titleInfo(): string {
    return this._titleInfo;
  }

  set titleInfo(value: string) {
    setTimeout(() => this._titleInfo = value, 1);
  }

  public get mayDebug(): boolean {
    return this.session.cfg.isDebug && (this.session.user?.may.debug || false);
  }

  public initDBData(data: BaseDBData): void {
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
    this.session.year = this.storage.read(CEM.YearStorage);
    if (this.session.year == null) {
      this.titleInfo = $localize`Lade Daten...`;
      this.session.year = YearData.factory();
      this.saveSession();
    }
    let dst = 'calendar';
    if (this.session.day != null) {
      dst = 'dashboard';
    }
    this.router.navigate([dst]);
  }

  saveSession(): void {
    this.storage.write(CEM.Config, this.session.cfg, false);
    this.storage.write(CEM.YearStorage, this.session.year, false);
    if (this.session.user.isAuthorized) {
      const list = [];
      for (const day of this.calendar.days) {
        list.push(day.toJson());
      }
      const data = {year: this.calendar.year, days: list};
      this.ds.update(CEM.Year, data).subscribe(result => {
        const ret = [];
        for (const day of result.days) {
          ret.push(JSON.parse(day));
        }
        result.days = ret;
        this.session.year = CEM.YearStorage.classify(result);
      }, error => {
        console.log(error);
        this.debug(error);
      });
    }
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
        this.extractServicebar(this.servicebarDefs.get(entry.defKey), entry.method);
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
    dlgRef.backdropClick().subscribe(event => {
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

  onOutletAction($event: any): any {
    this.servicebarComponent = $event;
  }
}
