import {Injectable} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {IBaseComponent} from '@/core/classes/ibase-component';

export class ControlError {
  text: string;
  formName: string;
}

export class ComponentError {
  text: string;
  route: string;
}

/**
 * Modus für die Verarbeitung. Hiermit werden interne Verarbeitungen gesteuert,
 * die in bestimmten Situationen benötigt werden.
 */
export enum ErrorMode {
  normal, // normaler Modus
  checkComponents// Alle Komponenten werden überprüft
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  mode = ErrorMode.normal;
  controlForm: IBaseComponent;
  controlIdx: number;
  errors = new Array<ControlError>();
  info = [];
  components = new Array<ComponentError>();
  showControlErrorsInControl = false;
  showControlErrorsInPanel = true;

  private legalizeIndex(idx: number, list: Array<any>): number {
    if (isNaN(idx)) {
      idx = 0;
    }
    if (idx >= list.length) {
      idx = list.length - 1;
    }
    if (idx < 0) {
      idx = 0;
    }
    if (idx >= list.length) {
      idx = null;
    }
    return idx;
  }

  get controlError(): ControlError {
    this.controlIdx = this.legalizeIndex(this.controlIdx, this.errors);
    if (this.controlIdx != null) {
      return this.errors[this.controlIdx];
    }
    return {text: '', formName: ''};
  }

  activateNextControl(): void {
    this.controlIdx = this.legalizeIndex(this.controlIdx + 1, this.errors);
  }

  activatePrevControl(): void {
    this.controlIdx = this.legalizeIndex(this.controlIdx - 1, this.errors);
  }

  constructor() {
  }

  /**
   * Löscht alle Fehler aus den internen Listen.
   */
  public clear(): void {
    if (this.mode !== ErrorMode.checkComponents) {
      this.controlForm = null;
      this.errors = new Array<ControlError>();
      this.components = new Array<ComponentError>();
    }
  }

  /**
   * Erstellt die Fehlernachricht für die Anzeige.
   * @param key   Key des Fehlers, muss mit dem Rückgabewert einer ValidatorFN Methode übereinstimmen
   * @param name  Label des Controls, das den Fehler verursacht
   * @param error Das Fehlerobjekt, das von ValidatorFN zurückgegeben wurde
   */
  extractErrorMessage(key: string, name: string, error: any): string {
    let msg = $localize`Unbekannter Fehler - ${key} / ${JSON.stringify(error)}`;
    switch (key) {
      case 'required':
        msg = $localize`${name} muss befüllt werden`;
        break;
      case 'minlength':
        msg = $localize`${name} muss mindestens ${error.requiredLength} Zeichen beinhalten`;
        break;
      case 'maxlength':
        msg = $localize`${name} darf maximal ${error.requiredLength} Zeichen beinhalten`;
        break;
      case 'min':
        msg = $localize`${name} muss mindestens den Wert ${error.min} enthalten`;
        break;
      case 'max':
        msg = $localize`${name} darf maximal den Wert ${error.max} enthalten`;
        break;
      case 'email':
        msg = $localize`${name} muss eine eMail-Adresse enthalten`;
        break;
      case 'creditcard':
        msg = $localize`${name} muss eine ${error.type}-Kreditkartennummer enthalten`;
        break;
      case 'equals':
        msg = $localize`${error.name1} muss mit ${error.name2} übereinstimmen`;
        break;
      case 'after':
        msg = $localize`${error.later} muss nach ${error.earlier} liegen`;
        break;
      case 'pattern':
        let pattern = error.requiredPattern;
        if (pattern.startsWith('^') && pattern.endsWith('$')) {
          pattern = pattern.substr(1, pattern.length - 2);
        }
        msg = $localize`${name} muss dem Format "${pattern}" entsprechen`;
        break;
    }
    return msg.trim();
  }

  validatorMessages(ctrlKey: string, name: string, errors: ValidationErrors): Array<ControlError> {
    const ret = [];
    if (errors == null) {
      return ret;
    }
    Object.keys(errors).forEach(key => {
      const value = errors[key];
      const msg = this.extractErrorMessage(key, name, errors[key]);
      ret.push({text: msg, formName: errors[key].focus ?? ctrlKey});
    });
    return ret;
  }

  /**
   * Überprüft die Controls auf Vollständigkeit.
   * @param base Komponente, die überprüft werden soll.
   * @private
   */
  private validateControls(base: IBaseComponent): void {
    this.controlForm = base;

    base.form.updateValueAndValidity();
    Object.keys(base.form.controls).forEach(ctrlKey => {
      const ctrl = base.form.get(ctrlKey); // controls[ctrlKey];
      ctrl.updateValueAndValidity();
      if (!ctrl.valid) {
        const result = ctrl.validator(ctrl);
        let ctrlName = ctrlKey;
        ctrlName = base.form.data[ctrlKey].label;
        base.form.get(ctrlKey).markAsTouched();
        this.errors = this.errors.concat(this.validatorMessages(ctrlKey, ctrlName, result));
      }
    });
  }

  /**
   * Überprüft die Seite auf Vollständigkeit.
   * @param base Komponente, die überprüft werden soll.
   * @private
   */
  private validatePage(base: IBaseComponent): void {
    const formErrors = this.validatorMessages('FormGroup', '', base.form.errors);
    if (formErrors.length > 0) {
      this.errors = this.errors.concat(formErrors);
    }
  }

  /**
   * Überprüft die Komponente auf Vollständigkeit.
   * @param base Komponente, die überprüft werden soll.
   * @returns true, wenn alles in Ordnung ist, false wenn mindestens ein Fehler vorhanden ist
   */
  public validate(base: IBaseComponent): boolean {
    this.errors = new Array<ControlError>();
    if (this.showControlErrorsInPanel) {
      this.validateControls(base);
    }
    this.validatePage(base);
    return this.errors.length === 0;
  }
}
