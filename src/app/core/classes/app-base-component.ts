import {ValidatorFn} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ServiceBarControl, SessionService} from '@/_services/session.service';
import {ComponentService} from '@/_services/component.service';
import {ControlObject, CPUFormGroup, FormConfig, IBaseComponent} from '@/core/classes/ibase-component';

/**
 * Basisklasse für die Komponenten, die den ComponentService verwenden sollen.
 */
@Component({template: ''})
export abstract class AppBaseComponent implements IBaseComponent, OnInit {

  @ViewChild('formDirective') formDirective;
  showMissingControlMessage = false;
  cfg = new FormConfig();
  form?: CPUFormGroup;
  abstract controls: ControlObject;
  readData: any;
  formValidators?: ValidatorFn | ValidatorFn[];
  servicebar: { [name: string]: ServiceBarControl } = {};
  servicebarDef?: ServiceBarControl[];
  noServicebar = true;
  protected debugKeys = [];

  protected constructor(public sessionService: SessionService,
                        public cs: ComponentService) {
  }

  /**
   * Initiiert die Speicherung der Session Daten
   */
  public writeSessionData(): boolean {
    return this.cs.writeSessionData(this);
  }

  /**
   * Liest die Daten aus der Session ein, die für die Komponente benötigt werden.
   * @returns Die Daten für die Komponente
   */
  abstract readFromSession(): any;

  public debug(id: string, key: string, ...optionalParams: any[]): void {
    if (key == null || this.debugKeys.indexOf(key) >= 0) {
      console.log(id, key, ...optionalParams);
    }
  }

  /**
   * Speichert die Daten in der Session, die von der Komponente befüllt wurden.
   * @param data Die mit den Formulardaten befüllten Daten, die bei [readFromSession]
   * zurückgegeben wurden
   */
  abstract writeToSession(data: any): boolean;

  saveSession(): void {
    this.sessionService.saveSession();
  }

  ngOnInit(): void {
    this.cs.init(this);
    const msg = this.cs.readSessionData(this);
    if (msg && this.showMissingControlMessage) {
      this.sessionService.debug(msg);
    }
  }

  /**
   * Soll das Control fokussieren. In Angular ist es nicht vorgesehen,
   * dass man anhand eines FormControls den Fokus setzen kann. Deswegen
   * wird hier das DOM bemüht, um zu versuchen, das Control zu finden.
   * @param formName Name des Controls in der FormControls Liste
   */
  activateControl(formName: string): void {
    let elem = document.querySelector(`[formName="${formName}"] mat-radio-button`);
    if (!elem) {
      elem = document.querySelector(`[formName="${formName}"] mat-select`);
    }
    if (!elem) {
      elem = document.querySelector(`[formName="${formName}"] input`);
    }
    if (elem) {
      (elem as any).focus();
    }
  }

  updateFormData(values: any): void {
    this.cs.updateFormData(values, this);
  }

  transferServicebarControls(): any {
    if (this.noServicebar) {
      return;
    }
    this.sessionService.servicebar = [];
    this.sessionService.servicebarInfo = null;

    // this.sessionService.ws.activate();
    // const key = this.sessionService.ws.current.servicebar;
    let servicebar = null;
    // if (key) {
    //   this.sessionService.servicebarInfo = `${this.constructor.name}[${key}]`;
    //   servicebar = this.sessionService.servicebarDefs[key];
    // }
    if ((this.servicebarDef || []).length > 0) {
      this.sessionService.servicebarInfo = this.constructor.name;
      servicebar = this.servicebarDef;
    }
    if (servicebar != null) {
      this.sessionService.servicebarComponent = this;
      this.sessionService.extractServicebar(servicebar);
    }
    for (const ctrl of this.sessionService.servicebar) {
      if (ctrl.name) {
        this.servicebar[ctrl.name] = ctrl;
      }
    }
  }
}
