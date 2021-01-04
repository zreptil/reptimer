import {BaseDBDataFactoryFn} from '@/_models/base-data';

export class ClassEPMap<T> {
  constructor(public endpoint: string,
              public factory?: BaseDBDataFactoryFn<T>) {
  }

  public classify(data: any): T {
    if (!this.factory) {
      return data;
    }

    data = this.fillClass(this.factory(), data);
    return data;
  }

  private fillClass(dst, src): any {
    if (src == null) {
      return null;
    }
    Object.keys(dst).forEach(key => {
      dst[key] = null;
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
      } else {
        if (src[key] != null) {
          dst[key] = src[key];
        }
      }
    });
    return dst;
  }
}
