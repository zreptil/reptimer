import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {CPUFormControl, CPUFormGroup} from '@/core/classes/ibase-component';

export class CPUValidators {
  static group = {
    username: [Validators.required, Validators.minLength(2)],
    password: [Validators.required, Validators.minLength(6)]
  };

  static errorOnUnknownItem(c: FormControl): any {
    return null;
  }

  static _errorOnUnknownItem(ctrl: CPUFormControl): ValidatorFn {
    return (c: FormControl): ValidationErrors | null => {
      if (ctrl == null || !ctrl.items) {
        return null;
      }
      return ctrl.items.find(item => item.value === c.value && !item.disabled) !== undefined ? null : {
        unknownItem: {
          valid: false,
        }
      };
    };
  }

  static email(c: FormControl): ValidationErrors | null {
    const EMAIL_REGEXP = /[^@]*@[^.]*\..*/;

    return EMAIL_REGEXP.test(c.value) ? null : {
      email: {
        valid: false
      }
    };
  }

  static equals(formName1: string, formName2: string): ValidatorFn {
    return (fg: CPUFormGroup): ValidationErrors | null => {
      const ctrl1 = fg.get(formName1);
      const ctrl2 = fg.get(formName2);
      let check = false;
      if (ctrl1 && ctrl2) {
        check = ctrl1.value === ctrl2.value;
      }

      return CPUValidators.handleError(check, {
        equals: {
          valid: false,
          name1: CPUValidators.getLabel(fg, formName1),
          name2: CPUValidators.getLabel(fg, formName2),
          focus: formName2
        }
      }, ctrl1, ctrl2);
    };
  }

  static after(earlier: string, later: string): ValidatorFn {
    return (fg: CPUFormGroup): ValidationErrors | null => {
      const ctrl1 = fg.get(earlier);
      const ctrl2 = fg.get(later);
      let check = true;
      try {
        const d1 = Date.parse(ctrl1.value);
        const d2 = Date.parse(ctrl2.value);
        if (!isNaN(d1) && !isNaN(d2)) {
          check = d1 < d2;
        }
      } catch {
      }

      return CPUValidators.handleError(check, {
        after: {
          valid: false,
          earlier: CPUValidators.getLabel(fg, earlier),
          later: CPUValidators.getLabel(fg, later),
          focus: later
        }
      }, ctrl1, ctrl2);
    };
  }

  static creditcard(type: string): ValidatorFn {
    function checkRegExp(key: string, value: string): boolean {
      const reglist = {
        amexcard: /3[47][0-9]{13}/,
        mastercard: /(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))/,
        visacard: /4[0-9]{12}(?:[0-9]{3})?/,
        visamastercard: /(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})/,
        dinersclubcard: /3(?:0[0-5]|[68][0-9])[0-9]{11}/
      };
      if (reglist[key]) {
        return reglist[key].test(value);
      }
      // if key is unknown, check if value matches at least one of the candidates
      let ret = false;
      Object.keys(reglist).forEach(regKey => {
        ret ||= reglist[regKey].test(value);
      });

      return ret;
    }

    return (c: FormControl): ValidationErrors | null => {
      const ret = checkRegExp(type, c.value);
      return ret ? null : {
        creditcard: {
          type,
          valid: false
        }
      };
    };
  }

  protected static getLabel(fg: CPUFormGroup, name: string): string {
    return fg.data ? fg.data[name]?.label || name : name;
  }

  protected static handleError(check: boolean, error: any, ...ctrls: AbstractControl[]): any {
    if (check) {
      error = null;
    }
    for (const ctrl of ctrls) {
      ctrl.setErrors(error);
    }
    return error;
  }
}
