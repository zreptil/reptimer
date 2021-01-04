import {SVItem} from '@/_models/sv-item';
import {SVService} from '@/_services/sv.service';
import {FormBuilder} from '@angular/forms';
import {Injectable} from '@angular/core';
import {ValidationService} from '@/_services/validation.service';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {ErrorService} from '@/_services/error.service';
import {ItemProviderService} from '@/_services/item-provider.service';
import {ErrorDisplayComponent} from '@/core/components/error-display/error-display.component';
import {CPUFormGroup, FormControl, IBaseComponent} from '@/core/classes/ibase-component';
import {DataService} from '@/_services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(public svService: SVService,
              private validator: ValidationService,
              public ds: DataService,
              private fb: FormBuilder,
              private bottomSheet: MatBottomSheet,
              private errorService: ErrorService,
              private ips: ItemProviderService) {
  }

  // Mapping of fields from DTO to presentation with interface ISelectItem

  // TODO: i18n
  toPresentation(item: SVItem): SVItem {
    item.label = '' + item.text;
    item.value = '' + item.svid;
    return item;
  }

  // Mapping of fields from Presentation to DTO with interface ISelectItem
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
    setTimeout(() => base.setSessionComponent(), 100);
    base.transferServicebarControls();
    this.errorService.clear();
    base.cfg.fbData = {};
    // TODO: Warum in 2 loops?
    Object.keys(base.controls).forEach(key => {
      const ctrl = {
        value: base.controls[key].value,
        disabled: base.controls[key].disabled
      };
      base.cfg.fbData[key] = [ctrl, base.controls[key].validators];
    });
    base.form = this.fb.group(base.cfg.fbData, {validators: base.formValidators}) as CPUFormGroup;
    base.form.data = {};
    Object.keys(base.controls).forEach(key => {
      base.form.data[key] = FormControl.create(base.controls[key]);
    });
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
   * @param base
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

  /**
   * Write input to session AFTER validation
   * @param base
   */
  // public writeSessionData(base: IBaseComponent): void {
  //   if (!this.errorService.validate(base)) {
  //     const cfg = new MatBottomSheetConfig();
  //     cfg.hasBackdrop = false;
  //     cfg.data = {type: 'controls'};
  //     this.bottomSheet.open(ErrorDisplayComponent, cfg)
  //       .afterDismissed().subscribe((dummy) => {
  //       }
  //     );
  //     return;
  //   }
  //   this.bottomSheet.dismiss();
  //   this.setValuesToFormData(base);
  //   base.writeToSession(base.readData);
  //   base.writeVorgangToBackend();
  //   base.saveSession();
  // }

  showError(base: IBaseComponent, msg: { class?: string, label: string }): void {
    console.log(msg);
    this.errorService.validate(base);
    this.errorService.info.push(msg);
    const cfg = new MatBottomSheetConfig();
    cfg.hasBackdrop = false;
    cfg.data = {type: 'controls'};
    this.bottomSheet.open(ErrorDisplayComponent, cfg)
      .afterDismissed().subscribe((dummy) => {
      }
    );
  }

  async writeSessionData(base: IBaseComponent): Promise<boolean> {
    if (!this.errorService.validate(base)) {
      const cfg = new MatBottomSheetConfig();
      cfg.hasBackdrop = false;
      cfg.data = {type: 'controls'};
      this.bottomSheet.open(ErrorDisplayComponent, cfg)
        .afterDismissed().subscribe((dummy) => {
        }
      );
      return false;
    }
    this.bottomSheet.dismiss();
    this.setValuesToFormData(base);
    return base.writeToSession(base.readData).then(success => {
      if (success) {
        base.saveSession();
      }
      return success;
    });
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

  /**
   * Initialisiert alle Listenfelder im Dialog
   * @private
   */
  private initLists(base: IBaseComponent): void {
    Object.keys(base.form.data).forEach(key => {
      const value = base.form.get(key).value;
      const dataCtrl = base.form.data[key];
      if (!dataCtrl.items && dataCtrl.itemProvider) {
        dataCtrl.items = [];
        if (!dataCtrl.isRequired && !dataCtrl.noEmptyItem) {
          dataCtrl.items.unshift({value: null, label: $localize`Keine Auswahl`});
        }
      }

      base.debug('initLists', key, value, dataCtrl);
      if (dataCtrl.itemProvider) {
        dataCtrl.itemProvider(this.ips, dataCtrl.itemProviderArg).subscribe((list: ISelectItem[]) => {
          const items = dataCtrl.items;
          list.forEach((item: ISelectItem) => {
            items.push(item);
          });
          if (base.controls[key].onItemsFilled) {
            dataCtrl.items = base.controls[key].onItemsFilled.bind(base)(items);
          } else {
            dataCtrl.items = items;
          }
          dataCtrl.value = value;
          // The value must be set to a string to change the value on the ui
          if (typeof value === 'number') {
            base.form.get(key).setValue(`${value}`);
          }
          if (base.controls[key].onValueChange) {
            base.controls[key].onValueChange.call(base, value);
          }
        });
      } else if (dataCtrl.items) {
        base.debug('initLists2', key, typeof value, value);
        let setValue = value;
        // The value must be set to a string to change the value on the ui
        if (typeof setValue === 'number') {
          setValue = `${setValue}`;
        }
        dataCtrl.value = setValue;
        base.form.get(key).setValue(setValue);
        base.form.data[key].value = setValue;
      }
    });
  }
}
