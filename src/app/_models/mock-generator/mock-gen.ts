import {BaseMock} from '@/_models/mock-generator/base-mock';

export declare type MockFactoryFn = () => BaseMock;

export class MockGen {
  static numberFill = 1;
  static dateFill = '13.02.2021';
  static stringFill = 'lorem ipsum';

  static isDate(name: string): boolean {
    const matchList = [/.*datum$/, /.*seit$/, /.*bis$/, /.*von$/];
    for (const match of matchList) {
      if (match.test(name.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  static fill(type: string | MockFactoryFn, name: string): any {
    if (typeof type === 'function') {
      return type();
    }

    const suffix = MockGen.numberFill > 1 ? `[${MockGen.numberFill}]` : '';
    switch (type) {
      case 'number':
        if (MockGen.isDate(name)) {
          return `${MockGen.dateFill}${suffix}`;
        }
        return 1; // MockGen.numberFill;
      case 'Date':
        return `${MockGen.dateFill}${suffix}`;
      case 'boolean':
        return Math.random() > 0.5;
      case 'string':
        return `${name}${suffix}`;
    }
    return type.toString();
  }

  static fillArray(factory: MockFactoryFn, name: string): any[] {
    const ret = [];
    MockGen.numberFill = 2;
    ret.push(factory());
    MockGen.numberFill = 3;
    ret.push(factory());
    MockGen.numberFill = 1;
    return ret;
  }
}
