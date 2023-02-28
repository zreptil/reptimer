import {UntypedFormGroup} from '@angular/forms';

export interface IComponentData {
  outerWidth: number;
  innerWidth: number;
  outerClass: string;
  innerClass: string;
  label: string;
  formName: string;
  formGroup: UntypedFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  alwaysShowDebugInfo: boolean;
}
