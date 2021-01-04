import {CPUFormGroup, FormControl} from '@/core/classes/ibase-component';

interface IBaseControl {
  label: string;
  formName: string;
  formGroup: CPUFormGroup;
}

export abstract class BaseControl implements IBaseControl {
  abstract label: string;
  abstract formName: string;
  abstract formGroup: CPUFormGroup;
  formDataInternal: any;

  get formData(): FormControl {
    // Der folgende Code ist notwendig, solange es noch Seiten gibt,
    // die nach dem alten System funktionieren sollen. Wenn das nicht
    // mehr der Fall ist, reicht hier folgende Zeile:
    //
    // return this.formGroup?.data[this.formName];
    //
    // Ausserdem kann formDataInternal entfernt werden.
    if (this.formDataInternal) {
      return this.formDataInternal;
    }
    if (this.formGroup?.data) {
      this.formDataInternal = this.formGroup?.data[this.formName] || {};
    } else {
      const ret = FormControl.create();
      ret.label = this.label;
      if ((this as any).items) {
        ret.items = [];
        for (const item of (this as any).items) {
          ret.items.push({checked: item.checked, label: item.viewValue, value: item.value});
        }
        // console.log(this.formName, ret.items);
      }
      this.formDataInternal = ret;
    }
    return this.formDataInternal;
  }
}
