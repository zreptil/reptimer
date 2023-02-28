import {UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {ItemProviderFn} from '@/_services/item-provider.service';
import {ServiceBarControl} from '@/_services/session.service';

export declare type GetTableRowDataFn = () => Iterable<ITableRowData>;

export declare type ValueChangeFn = (value: any) => void;
export declare type ItemsFilledFn = (value: any[]) => any[];
export declare type ControlObject = { [key: string]: IFormControl; };

export class FormConfig {
  fbData?: any;
}

export interface IBaseComponent {
  cfg: FormConfig;
  form?: CPUFormGroup;
  controls: ControlObject;
  readData: any;
  formValidators?: ValidatorFn | ValidatorFn[];
  servicebarDef?: ServiceBarControl[];

  readFromSession(): any;

  writeToSession(data: any): boolean;

  transferServicebarControls(): any;

  saveSession(): void;

  activateControl(formName: string): void;

  debug(id: string, key: string, ...optionalParams: any[]): void;
}

export interface IFormControl {
  label?: string;
  items?: ISelectItem[];
  itemProvider?: ItemProviderFn;
  itemProviderArg?: any;
  noEmptyItem?: boolean;
  validators?: ValidatorFn[] | ValidatorFn;
  value?: any;
  selectedItem?: any;
  disabled?: boolean;
  onValueChange?: ValueChangeFn;
  onItemsFilled?: ItemsFilledFn;
  tableRowData?: GetTableRowDataFn;
  min?: number;
  max?: number;
  // properties needed for DialogComponent
  type?: 'selectgroup' | 'radiogroup' | null;
  key?: string;
}

export class CPUFormControl implements IFormControl {
  label: string;
  items: ISelectItem[];
  orgItems: ISelectItem[];
  itemProvider: ItemProviderFn;
  itemProviderArg: any;
  noEmptyItem: boolean;
  selectedItem: any;
  validators: ValidatorFn[] | ValidatorFn;
  valueInternal: any;
  disabled: boolean;
  onValueChange: ValueChangeFn;
  tableRowData: GetTableRowDataFn;
  type?: 'selectgroup' | 'radiogroup' | null;
  min: number;
  max: number;

  get value(): any {
    return this.valueInternal;
  }

  set value(value: any) {
    this.valueInternal = value;
    if (this.items) {
      this.selectedItem = this.items.find((e) => e.value === value);
    }
  }

  get isRequired(): boolean {
    const check = Array.isArray(this.validators) ? this.validators[0] : this.validators;
    return check === Validators.required;
  }

  static create(src?: IFormControl): CPUFormControl {
    const ret = new CPUFormControl();
    if (src) {
      ret.label = src.label;
      ret.items = src.items;
      ret.itemProvider = src.itemProvider;
      ret.itemProviderArg = src.itemProviderArg;
      ret.noEmptyItem = src.noEmptyItem;
      ret.validators = src.validators;
      ret.value = src.value;
      ret.selectedItem = src.selectedItem;
      ret.tableRowData = src.tableRowData;
      ret.min = src.min;
      ret.max = src.max;
      if (ret.items) {
        ret.orgItems = [];
        ret.items.forEach((item: ISelectItem) => {
          ret.orgItems.push(item);
        });
      }
    }
    return ret;
  }
}

export class CPUFormGroup extends UntypedFormGroup {
  data: { [key: string]: CPUFormControl } = {};
}

// tslint:disable-next-line:no-empty-interface
export interface ITableRowData {
}

