import {ClassEPMap} from '@/_models/class-epmap';
import {BaseDBData} from '@/_models/base-data';

export class EditData extends BaseDBData {
  static CEM = new ClassEPMap<EditData>('edit', EditData.factory);
  xmlCfg = {
    className: 'EditData'
  };

  edit: { [key: string]: EditData } = {};
  data: any = null;
  editOBJ = EditData.CEM;
  private savedIds = [];

  constructor(src: any, public listKey: string, public idKey: string, public id: number) {
    super();
    this.readData(src);
  }

  static factory(): EditData {
    const ret = new EditData(null, null, null, null);
    ret.edit = {};
    return ret;
  }

  toJson(): any {
    const ret = {
      listKey: this.listKey,
      idKey: this.idKey,
      id: this.id,
      edit: {}
    };
    Object.keys(ret).forEach(key => {
      if (!ret[key]) {
        delete ret[key];
      }
    });
    if (this.edit != null) {
      Object.keys(this.edit).forEach(key => {
        ret.edit[key] = this.edit[key].toJson();
      });
    }
    return ret;
  }

  add(path: string, key: string, id: number, data?: any): any {
    let parts = path.split('.');
    if (parts.length === 1) {
      parts = parts[0].split('[');
      if (parts.length !== 2 || parts[1].length < 2) {
        // console.error($localize`Fehlerhafter Pfad bei EditData.add(${path}, ${key}, ${id})`);
        return null;
      }
      if (!Array.isArray(this.data[parts[0]])) {
        // console.error($localize`${parts[0]} ist kein Array bei EditData.add(${path}, ${key}, ${id})`);
        return null;
      }
      const listKey = parts[1].substring(0, parts[1].length - 1);
      this.edit[key] = new EditData(this.data, parts[0], listKey, id);
      if (data != null) {
        this.edit[key].data = data;
      }
      return this.edit[key].data;
    } else {
      const prop = parts[0];
      parts.splice(0, 1);
      if (this.edit[prop]) {
        this.edit[prop].add(parts.join('.'), key, id);
      }
    }
    return null;
  }

  get(path: string): EditData {
    const parts = path.split('.');
    if (parts.length === 1) {
      if (this.edit[parts[0]]) {
        return this.edit[parts[0]];
      }
    } else {
      const prop = parts[0];
      parts.splice(0, 1);
      if (this.edit[prop]) {
        return this.edit[prop].get(parts.join('.'));
      }
    }
    return null;
  }

  clear(keys?: string | string[]): void {
    if (keys == null) {
      this.edit = {};
    } else if (Array.isArray(keys)) {
      for (const key of keys) {
        this.clear(key);
      }
    } else {
      const parts = keys.split('.');
      const key = parts[0];
      const rest = parts.slice(1);
      if (rest.length === 0) {
        delete this.edit[key];
      } else {
        this.edit[key].clear(rest.join('.'));
      }
    }
  }

  prepareRefresh(parent?: EditData): void {
    this.savedIds = [];
    if (this.id == null && parent != null && parent.data != null) {
      const list = parent.data[this.listKey];
      for (const entry of list) {
        if (entry[this.idKey] != null) {
          this.savedIds.push(entry[this.idKey]);
        }
      }
    }
    Object.keys(this.edit).forEach(key => {
      if (this.edit[key] != null) {
        this.edit[key].prepareRefresh(this);
      }
    });
  }

  refresh(parent?: EditData): void {
    console.log('refresh für', this.data, this.savedIds, parent);
    if (parent != null) {
      const saved = this.data;
      this.readData(parent.data);
      if (this.data == null) {
        this.data = saved;
        console.log('Daten wurden beibehalten, weil sie im Parent fehlen', this.data);
      }
    }
    if (this.edit != null) {
      Object.keys(this.edit).forEach(key => {
        if (this.edit[key] != null) {
          this.edit[key].refresh(this);
        }
      });
    }
  }

  create(): any {
  }

  private readData(src): void {
    if (src != null && src[this.listKey] != null) {
      if (this.savedIds != null && this.id == null) {
        for (const entry of src[this.listKey]) {
          if (this.savedIds.indexOf(entry[this.idKey]) < 0) {
            this.id = entry[this.idKey];
            console.log(`Neue Id ${this.id} verwendet`, this.data, src[this.listKey]);
          }
        }
      }
      this.savedIds = [];
      this.data = src[this.listKey].find(v => v[this.idKey] === this.id);
    } else {
      console.error(`${this.listKey} konnte nicht gefunden werden in`, src);
    }
  }
}
