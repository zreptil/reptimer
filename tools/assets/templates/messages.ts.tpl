/* tslint:disable:object-literal-key-quotes object-literal-sort-keys ordered-imports trailing-comma */
import '@angular/localize/init';
import {loadTranslations} from '@angular/localize';

const messages = [@dataList@
];

const check = localStorage.getItem('language') || 'de';
let lng = messages.find((lang) => lang.id === check);
if (!lng) {
  lng = messages[0];
}

loadTranslations(lng.data);
