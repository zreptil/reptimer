import {Injectable} from '@angular/core';
import {SessionData} from '@/_models/session-data';

import {DialogData, DialogResult, DialogResultButton, DialogType} from '@/_models/dialog-data';
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
import {ClassEPMap} from '@/_models/class-epmap';
import {CEM} from '@/_models/cem';
import {YearData} from '@/_models/year-data';

/**
 * Class to manage sessionStorage
 */
class Storage {

  constructor(private ds: DataService) {
  }

  /**
   * Gets a random integer number in range [0..max]
   * @param max   maximum value for the number
   * @private
   */
  private static rnd(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Decrypts a string, if it starts with a @
   * @param src  the string to decrypt
   * @private
   */
  private static decrypt(src: string): string {
    if (src == null) {
      return '';
    }
    if (!src.startsWith('@')) {
      return src;
    }

    src = src.substring(1);
    let ret = '';
    const pos = Math.floor(src.length / 2);
    src = `${src.substring(pos + 1)}${src.substring(0, pos - 1)}`;
    try {
      ret = atob(src);
      // .forEach((value) {
      //    ret = '${ret}${String.fromCharCode(value)}';
      //  });
      // ret = convert.utf8.decode(ret.codeUnits);
    } catch (ex) {
      console.error(src, ex.message);
    }

    return ret;
  }

  /**
   * Encrypts a string and prepends a @
   * @param src  string to encrypt
   * @private
   */
  private static encrypt(src: string): string {
    let ret = btoa(src);
    const pos = Math.floor(ret.length / 2);
    String.fromCharCode(Storage.rnd(26) + 64);
    ret =
      `@${ret.substring(pos)}${String.fromCharCode(Storage.rnd(26) + 64)}` +
      `${String.fromCharCode(Storage.rnd(10) + 48)}${ret.substring(0, pos)}`;
    return ret;
  }

  /**
   * Reads a value from sessionStorage
   * @param type typeinformation for the data
   * @returns value read from sessionStorage
   */
  read<T>(type: ClassEPMap<T>): T {
    const src = localStorage.getItem(type.endpoint);
    if (src == null) {
      return null;
    }
    let ret = null;
    try {
      ret = type.classify(JSON.parse(Storage.decrypt(src)));
      console.log('Session: read', ret);
    } catch (ex) {
      console.error(src, ex.message);
    }
    return ret;
  }

  /**
   * writes a value to sessionStorage
   * @param type    typeinformation for the data
   * @param value   the value, will be converted to string using JSON.stringify
   * @param encrypt if true, the value is encrypted before written to sessionStorage
   */
  write<T>(type: ClassEPMap<T>, value: BaseDBData, encrypt: boolean = true): void {
    console.log('writing', value);
    let data = value.toJson();
    if (encrypt) {
      data = Storage.encrypt(data);
    }
    localStorage.setItem(type.endpoint, data);
  }

  /**
   * Removes a value from sessionStorage
   * @param key identifier for the value
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

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
    // ['prev', [{
    //   label: '@prev',
    //   icon: 'navigate_before',
    //   position: 'left',
    //   method: (self: any) => {
    //     self.sessionService.navigatePrev();
    //   }
    // }]],
    // ['next', [{
    //   label: '@next',
    //   icon: 'navigate_next',
    //   position: 'right',
    //   method: (self: any) => {
    //     self.sessionService.navigateNext();
    //   }
    // }]],
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
  private selKontoId = 0;
  private storage = new Storage(this.ds);

  constructor(private dialog: MatDialog,
              private as: AuthenticationService,
              private ds: DataService,
              private router: Router,
              public env: EnvironmentService
  ) {
    this.loadSession();
    this.languageCode = localStorage.getItem('language') || 'de-DE';
  }

  _titleInfo: string;

  get titleInfo(): string {
    return this._titleInfo;
  }

  set titleInfo(value: string) {
    setTimeout(() => this._titleInfo = value, 1);
  }

  get hasServicebar(): boolean {
    return this.servicebar.length > 0;
  }

  public initDBData(data: BaseDBData): void {
//    data.createuser = `${this.as.currentUserValue.idUserAccount}`;
  }

  logout(): void {
    this.storage.remove('vorgang');
    this.as.logout();
  }

  // **********************************************************************
  // Sessiondata Methods
  // **********************************************************************
  loadSession(): void {
    this.session.year = this.storage.read(CEM.Year);
    if (this.session.year == null) {
      this.titleInfo = $localize`Lade Daten...`;
      this.session.year = YearData.factory();
      this.saveSession();
    }
    let dst = 'calendar';
    if (this.session.year.day != null) {
      dst = 'dashboard';
    }
    this.router.navigate([dst]);
  }

  saveSession(): void {
    this.storage.write(CEM.Year, this.session.year, false);
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

  showDialog(type: DialogType, content: string | string[] | ControlObject): Observable<DialogResult> {
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
