import {ValidatorFn} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ServiceBarControl, SessionService} from '@/_services/session.service';
import {ComponentService} from '@/_services/component.service';
import {ControlObject, CPUFormGroup, FormConfig, IBaseComponent} from '@/core/classes/ibase-component';
import {CEM} from '@/_models/cem';

/**
 * Basisklasse für die Komponenten, die den ComponentService verwenden sollen.
 */
@Component({template: ''})
export abstract class AppBaseComponent implements IBaseComponent, OnInit {

  @ViewChild('formDirective') formDirective;
  skipMissingControlMessage = false;
  cfg = new FormConfig();
  form?: CPUFormGroup;
  abstract controls: ControlObject;
  readData: any;
  formValidators?: ValidatorFn | ValidatorFn[];
  servicebar: { [name: string]: ServiceBarControl } = {};
  protected debugKeys = [];

  protected constructor(public sessionService: SessionService,
                        public cs: ComponentService) {
  }

  setSessionComponent(): void {
    this.sessionService.currentComponent = this;
  }

  /**
   * Initiiert die Speicherung der Session Daten
   */
  public writeSessionData(): Promise<boolean> {
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
  async abstract writeToSession(data: any): Promise<boolean>;

  saveSession(): void {
    this.sessionService.saveSession();
  }

  ngOnInit(): void {
    this.cs.init(this);
    const msg = this.cs.readSessionData(this);
    if (msg && !this.skipMissingControlMessage) {
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
    for (const ctrl of this.sessionService.servicebar) {
      if (ctrl.name) {
        this.servicebar[ctrl.name] = ctrl;
      }
    }
  }
}
