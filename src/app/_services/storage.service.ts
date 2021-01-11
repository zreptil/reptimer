import {ClassEPMap} from '@/_models/class-epmap';
import {BaseDBData} from '@/_models/base-data';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {
  }

  /**
   * Gets a random integer number in range [0..max]
   * @param max   maximum value for the number
   * @private
   */
  private static rnd(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Decrypts a string, if it starts with a @
   * @param src  the string to decrypt
   * @private
   */
  private static decrypt(src: string): string {
    if (src == null) {
      return '';
    }
    if (!src.startsWith('@')) {
      return src;
    }

    src = src.substring(1);
    let ret = '';
    const pos = Math.floor(src.length / 2);
    src = `${src.substring(pos + 1)}${src.substring(0, pos - 1)}`;
    try {
      ret = atob(src);
      // .forEach((value) {
      //    ret = '${ret}${String.fromCharCode(value)}';
      //  });
      // ret = convert.utf8.decode(ret.codeUnits);
    } catch (ex) {
      console.error(src, ex.message);
    }

    return ret;
  }

  /**
   * Encrypts a string and prepends a @
   * @param src  string to encrypt
   * @private
   */
  private static encrypt(src: string): string {
    let ret = btoa(src);
    const pos = Math.floor(ret.length / 2);
    String.fromCharCode(StorageService.rnd(26) + 64);
    ret =
      `@${ret.substring(pos)}${String.fromCharCode(StorageService.rnd(26) + 64)}` +
      `${String.fromCharCode(StorageService.rnd(10) + 48)}${ret.substring(0, pos)}`;
    return ret;
  }

  /**
   * Reads a value from sessionStorage
   * @param type typeinformation for the data
   * @returns value read from sessionStorage
   */
  read<T>(type: ClassEPMap<T>): T {
    const src = localStorage.getItem(type.endpoint);
    if (src == null) {
      return null;
    }
    let ret = null;
    try {
      console.log('read src', StorageService.decrypt(src));
      ret = type.classify(JSON.parse(StorageService.decrypt(src)));
      console.log('read ret', ret);
    } catch (ex) {
      console.error(src, ex.message);
    }
    return ret;
  }

  /**
   * writes a value to sessionStorage
   * @param type    typeinformation for the data
   * @param value   the value, will be converted to string using JSON.stringify
   * @param encrypt if true, the value is encrypted before written to sessionStorage
   */
  write<T>(type: ClassEPMap<T>, value: BaseDBData, encrypt: boolean = true): void {
    let data = value.asString;
    if (encrypt) {
      data = StorageService.encrypt(data);
    }
    localStorage.setItem(type.endpoint, data);
  }

  /**
   * Removes a value from sessionStorage
   * @param key identifier for the value
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
