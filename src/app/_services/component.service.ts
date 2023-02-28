import {SVItem} from '@/_models/sv-item';
import {SVService} from '@/_services/sv.service';
import {UntypedFormBuilder} from '@angular/forms';
import {Injectable} from '@angular/core';
import {ValidationService} from '@/_services/validation.service';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {ErrorService} from '@/_services/error.service';
import {ItemProviderService} from '@/_services/item-provider.service';
import {ErrorDisplayComponent} from '@/core/components/error-display/error-display.component';
import {CPUFormControl, CPUFormGroup, IBaseComponent} from '@/core/classes/ibase-component';
import {DataService} from '@/_services/data.service';
import {CPUValidators} from '@/core/classes/validators';
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  public showOverlay = false;

  // Mapping of fields from DTO to presentation with interface ISelectItem

  constructor(public svService: SVService,
              private validator: ValidationService,
              public ds: DataService,
              private fb: UntypedFormBuilder,
              private bottomSheet: MatBottomSheet,
              private errorService: ErrorService,
              private ips: ItemProviderService) {
  }

  // Mapping of fields from Presentation to DTO with interface ISelectItem

  // TODO: i18n
  toPresentation(item: SVItem): SVItem {
    item.label = '' + item.text;
    item.value = '' + item.svid;
    return item;
  }

  // TODO: i18n
  toDTO(item: SVItem): SVItem {
    item.text = item.label;
    item.svid = +item.value;
    return item;
  }

  /**
   * Init the dialog controls
   * @param base The dialog to be initialized
   */
  public init(base: IBaseComponent): void {
    setTimeout(() => base.transferServicebarControls(), 1);
    this.errorService.clear();
    base.cfg.fbData = {};
    const data = {};
    Object.keys(base.controls).forEach(key => {
      const src = base.controls[key];
      const ctrl = CPUFormControl.create(src);
      let list = src.validators;
      if (!Array.isArray(list)) {
        list = [list];
      }
      let validators = [];
      for (const item of list) {
        if (item === CPUValidators.errorOnUnknownItem) {
          validators.push(CPUValidators._errorOnUnknownItem(ctrl));
        } else {
          validators.push(item);
        }
      }
      switch (validators.length) {
        case 0:
          validators = null;
          break;
        case 1:
          validators = validators[0];
          break;
      }
      base.cfg.fbData[key] = [{
        value: src.value,
        disabled: src.disabled
      }, validators];
      data[key] = ctrl;
    });
    base.form = this.fb.group(base.cfg.fbData, {validators: base.formValidators}) as CPUFormGroup;
    base.form.data = data;
  }

  updateFormData(values: any, base: IBaseComponent): any {
    base.readData = values;
    // console.log('Datenobjekt', values);
    const unknown = [];
    Object.keys(base.form.value).forEach(key => {
      if (values?.[key] === undefined) {
        unknown.push(key);
      }
      let value = values?.[key];
      // Wenn das Element gespeichert wurde und nicht nur der Wert,
      // wird der Wert extrahiert
      if (value && value.value) {
        value = value.value;
      }
      base.form.get(key).setValue(value);
      base.form.data[key].value = value;
    });
    let ret = null;
    if (unknown.length > 0) {
      ret = [
        `In der Klasse ${base.constructor.name} fehlen einige Formularfelder.`,
        'Die Methode readFromSession sollte zusätzlich diese Felder zurückgeben:',
        `{\n${unknown.join(': \'\',\n')}: ''\n}`
      ];
      // console.error(ret[0]);
      // console.log(ret[1]);
      // console.log(ret[2]);
    }
    return ret;
  }

  /**
   * Fill all fields with data from selected Vorgang in sessionService.
   * @param base Intance of Component
   */
  public readSessionData(base: IBaseComponent): any {
    const ret = this.updateFormData(base.readFromSession(), base);
    Object.keys(base.controls).forEach(key => {
      base.debug('readSessionData', key, base.form.get(key).value);
      if (base.controls[key].onValueChange) {
        base.form.get(key).valueChanges.subscribe(value => {
          base.debug('readSessionData valueChanges', key, value);
          base.controls[key].onValueChange.call(base, value);
        });
      }
    });
    this.initLists(base);
    return ret;
  }

  writeSessionData(base: IBaseComponent): boolean {
    this.showOverlay = false;
    if (!this.errorService.validate(base)) {
      const cfg = new MatBottomSheetConfig();
      cfg.hasBackdrop = false;
      cfg.data = {type: 'controls'};
      this.bottomSheet.open(ErrorDisplayComponent, cfg)
        .afterDismissed().subscribe((_dummy) => {
        }
      );
      this.showOverlay = false;
      return false;
    }
    this.bottomSheet.dismiss();
    this.setValuesToFormData(base);
    const ret = base.writeToSession(base.readData);
    if (ret) {
      base.saveSession();
    }
    this.showOverlay = false;
    return ret;
  }

  public setValuesToFormData(base: IBaseComponent): void {
    Object.keys(base.cfg.fbData).forEach(key => {
      this.setValueToFormData(key, base);
    });
  }

  public setValueToFormData(key: string, base: IBaseComponent): void {
    const value = base.form.get(key).value;
    base.form.data[key].value = value;
    if (typeof value === 'boolean') {
      base.readData[key] = value ? 1 : 0;
    } else {
      base.readData[key] = value;
    }
    base.debug('setValueToFormData', key, value);
  }

  private initLists(base: IBaseComponent): void {
    Object.keys(base.form.data).forEach(key => {
      const value = base.form.get(key).value;
      const dataCtrl = base.form.data[key];
      if (!dataCtrl.orgItems && dataCtrl.itemProvider) {
        dataCtrl.items = [];
        if (!dataCtrl.isRequired && !dataCtrl.noEmptyItem) {
          dataCtrl.items.unshift({value: null, label: $localize`Keine Auswahl`});
        }
      }

      base.debug('initLists', key, value, dataCtrl);
      if (dataCtrl.itemProvider) {
        dataCtrl.itemProvider(this.ips, dataCtrl.itemProviderArg).subscribe((list: ISelectItem[]) => {
          let items = dataCtrl.orgItems || [];
          list.forEach((item: ISelectItem) => {
            items.push(item);
          });
          if (base.controls[key].onItemsFilled) {
            items = base.controls[key].onItemsFilled.bind(base)(items);
          }
          this.setListValue(base, dataCtrl, items, key, value);
          if (base.controls[key].onValueChange) {
            base.controls[key].onValueChange.call(base, value);
          }
        });
      } else if (dataCtrl.orgItems) {
        base.debug('initLists2', key, typeof value, value);
        const items = [];
        dataCtrl.orgItems.forEach((item: ISelectItem) => {
          items.push(item);
        });
        this.setListValue(base, dataCtrl, items, key, value);
      }
    });
  }

  // noinspection JSMethodCanBeStatic
  private setListValue(base: IBaseComponent, dataCtrl: CPUFormControl, items: ISelectItem[],
                       key: string, value: string | string[]): void {
    const isArray = Array.isArray(value);
    if (!isArray && value != null) {
      value = `${value}`;
    }
    base.debug('setListValue', key, value, dataCtrl, base.form.get(key));
    let found = value === '' || value === 'null' || value === 'undefined' || value == null;
    found ||= items.find(item => item.value === value) !== undefined;
    if (!found && !isArray) {
      items.splice(0, 0, {value, label: $localize`Ungültiger Wert [${value}]`, invalid: true});
    }
    dataCtrl.items = items;
    dataCtrl.value = value;
    base.form.get(key).setValue(value);
    base.form.data[key].value = value;
  }
}
