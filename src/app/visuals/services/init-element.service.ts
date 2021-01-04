import { Injectable } from '@angular/core';
import {IComponentData} from '@/visuals/model/icomponent-data';

@Injectable({
  providedIn: 'root'
})
export class InitElementService {

  constructor() { }

  setDefaultContext(to: IComponentData): void{
    if (to !== null &&
    to !== undefined){
      to.outerWidth = 1;
      to.innerWidth = 1;
      to.outerClass = null;
      to.innerClass = null;
      to.label = '';
      to.formName = '';
      to.formGroup = null;
      to.alwaysShowDebugInfo = false;
    }
  }

  initContext(from: IComponentData): IComponentData {
    let ret = null;
    if (from !== null &&
    from !== undefined) {
      ret = {
        outerWidth: from.outerWidth,
        innerWidth: from.innerWidth,
        outerClass: from.outerClass,
        innerClass: from.innerClass,
        label: from.label,
        formName: from.formName,
        formGroup: from.formGroup,
        alwaysShowDebugInfo: from.alwaysShowDebugInfo
      };
    }
    return ret;
  }

  /*
    to: eine Input-Componente;

    Achtung! Da hier die Objekte einfach gemerged werden, sollte man aufpassen, dass das from-Objekt nur
    die benötigten Eigenschaften der Schnittstelle aufweist. Sonst besteht die Gefahr, dass das Input-Component
    (to) beschädigt wird.
   */
  mergeContext(from: IComponentData, to: IComponentData): IComponentData {
    let ret = null;

    if (from !== null &&
    from !== undefined &&
      to !== null &&
      to !== undefined) {
      ret = {...to, ...from};
    }
    return ret;
  }
}
