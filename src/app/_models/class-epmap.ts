import {BaseDBDataFactoryFn} from '@/_models/base-data';

export class CEMOptions {
  forceNull = true;
}

export class ClassEPMap<T> {
  constructor(public endpoint: string,
              public factory?: BaseDBDataFactoryFn<T>) {
  }

  public classify(data: any, options = new CEMOptions()): T {
    if (!this.factory) {
      return data;
    }

    data = this.fillClass(this.factory(), data, options);
    return data;
  }

  private fillClass(dst, src, options: CEMOptions): any {
    if (!src) {
      return null;
    }

    Object.keys(dst).forEach(key => {
      if (options.forceNull) {
        dst[key] = null;
      }
      if (dst[key + 'ARR']) {
        if (src[key] != null) {
          const list = [];
          for (const entry of src[key]) {
            list.push(dst[key + 'ARR'].classify(entry));
          }
          dst[key] = list;
        }
      } else if (dst[key + 'FCT']) {
        if (src[key] != null) {
          dst[key] = dst[key + 'FCT'].classify(src[key]);
        }
      } else if (dst[key + 'OBJ']) {
        dst[key] = {};
        if (src[key] != null) {
          Object.keys(src[key]).forEach(subKey => {
            dst[key][subKey] = dst[key + 'OBJ'].classify(src[key][subKey]);
          });
        }
      } else {
        if (src[key] != null) {
          dst[key] = src[key];
        }
      }
    });
    return dst;
  }
}
