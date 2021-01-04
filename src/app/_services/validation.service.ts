import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  getValidatorErrorMessage(validatorName: string, validatorValue?: any): any {
    const config = {
      required: $localize`Pflichteingabe`,
      invalidCreditCard: $localize`Fehlerhafte Kreditkartennummer`,
      invalidEmailAddress: $localize`Fehlerhafte eMail Adresse`,
      invalidPassword: $localize`Ungültiges Passwort. Das Passwort muss mindestens 6 Zeichen `
        + `lang sein und eine Zahl beinhalten.`,
      minlength: $localize`Mindestens ${validatorValue.requiredLength} Zeichen erforderlich`,
      maxlength: $localize`Nicht mehr als ${validatorValue.requiredLength} Zeichen`
    };

    return config[validatorName];
  }

  creditCardValidator(control): null | { invalidCreditCard: true } {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return {invalidCreditCard: true};
    }
  }

  emailValidator(control): null | { invalidEmailAddress: true } {
    // RFC 2822 compliant regex
    if (!control.value) {
      return null;
    }

    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return {invalidEmailAddress: true};
    }
  }

  passwordValidator(control): null | { invalidPassword: true } {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {invalidPassword: true};
    }
  }
}
