import {CPUFormControl, CPUFormGroup} from '@/core/classes/ibase-component';

export interface IBaseControl {
  label: string;
  formName: string;
  formGroup: CPUFormGroup;
}

export abstract class BaseControl implements IBaseControl {
  abstract label: string;
  abstract formName: string;
  abstract formGroup: CPUFormGroup;
  formDataInternal: any;

  constructor() {
  }

  get formData(): CPUFormControl {
    this.formDataInternal = this.formGroup?.data?.[this.formName];
    if (this.formDataInternal == null) {
      this.formDataInternal = {label: this.label};
    }
    return this.formDataInternal;
  }

  onValueChanges(value: any): void {
  }
}
