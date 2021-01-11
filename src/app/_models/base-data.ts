import {MockGen} from '@/_models/mock-generator/mock-gen';
import {SVMap} from '@/core/classes/svmap.enum';
import {SVService} from '@/_services/sv.service';

export declare type BaseDataFactoryFn = () => BaseData;
export declare type BaseDBDataFactoryFn<T> = () => T;

export class BaseDataConfig {
  className: string;
  skipxml?: Array<string>;
}

export class SVMapParam {
  key: SVMap;
  list: any[];
}

export abstract class BaseData {
  static removeEmpty = true;
  static fillEmpty = false;
  static fillData = false;

  abstract xmlCfg: BaseDataConfig;

  // abstract fkUserMandant: number;
  // abstract createtime: Date;
  // abstract createuser: string;
  // abstract locktime: Date;
  // abstract lockuser: string;
  // abstract modifytime: Date;
  // abstract modifyuser: string;
  // abstract deleted: number;
  // abstract readonly: number;

  static xml(factory: any, value: any, sv: SVService): string {
    return factory.toXML(null, value || BaseData.removeEmpty ? null : factory, sv);
  }

  static openTag(name: string): string {
    return `<${name}>`;
  }

  static closeTag(name: string): string {
    return `</${name}>`;
  }

  static valueOf(key: string, check: any, value: any): string {
    if (BaseData.fillData) {
      value = null;
    }
    if (value == null && BaseData.fillEmpty) {
      value = key;
      if (MockGen.isDate(key)) {
        return '13.02.2021';
      }
      const matchList = [/.*time$/];
      for (const match of matchList) {
        if (match.test(key.toLowerCase())) {
          return '13.02.2021, 12:34';
        }
      }
    } else {
      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      } else if (MockGen.isDate(key)) {
        if (MockGen.isDate(key) && value) {
          value = `${value}`;
          return value.substring(6, 8) + '.' + value.substring(4, 6) + '.' + value.substring(0, 4);
        }
      }
    }
    return value;
  }

  public static join(parts: string[], separator: string): string {
    parts = parts.filter((value, idx) => {
        return value != null && value !== '';
      }
    );
    return parts.join(separator);
  }

  abstract create(): any;

  public valueForXML(self: any, key: string, sv: SVService): any {
    return self[key];
  }

  public _valueForXML(self: any, key: string, sv: SVService): any {
    if (key.startsWith('xml')) {
      try {
        return this.valueForXML(self, key, sv);
      } catch (ex) {
        console.log(ex);
      }
    }
    return self[key];
  }

  public toXML(tag: string, instance: any, sv: SVService): string {
    if (instance == null) {
      return null;
    }
    if (tag && tag.endsWith('Mock')) {
      tag = tag.replace(/Mock$/, 'Data');
    }
    let ret = tag == null ? '' : BaseData.openTag(tag);
    Object.keys(this).forEach(key => {
      if (key === 'xmlCfg' || this.xmlCfg.skipxml?.indexOf(key) >= 0) {
        return;
      }
      const check = this[key];
      let value = this._valueForXML(instance, key, sv);
      if (check instanceof Array) {
        value = '';
        let list = check;
        if (instance[key] instanceof Array) {
          list = instance[key];
        }
        for (const item of list) {
          const itemTag = this[key][0].xmlCfg.className || this[key][0].constructor.name;
          let builder = item;
          if (!builder.toXML) {
            // Wenn das item selbst die Methode toXML nicht hat, ist es ein JSON-Objekt.
            // Dann hat die Factory-Klasse (this) im aktuellen Array an erster Stelle
            // einen Klassenbasierten Eintrag, der diese Methode hat.
            builder = this[key][0];
          }
          value += builder.create().toXML(itemTag, item, sv);
        }
      } else if (typeof check === 'object') {
        if (value?.create) {
          value = value.create().toXML(null, value, sv);
        } else if (check?.create) {
          value = check.create().toXML(null, value, sv);
        } else {
          value = BaseData.valueOf(key, check, value);
        }
      } else {
        value = BaseData.valueOf(key, instance[key], value);
      }
      if (value || !BaseData.removeEmpty) {
        ret += `${BaseData.openTag(key)}${value || ''}${BaseData.closeTag(key)}`;
      }
    });
    ret += tag == null ? '' : BaseData.closeTag(tag);
    return ret;
  }
}

export abstract class BaseDBData extends BaseData {
  get asString(): string {
    return JSON.stringify(this.toJson());
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this, (key, value) => {
      if (key === 'xmlCfg' || key.endsWith('ARR')) {
        return undefined;
      }
      return value;
    }));
  }
}

