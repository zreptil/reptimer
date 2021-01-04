import {BaseData, BaseDataConfig} from '@/_models/base-data';

export abstract class BaseMock extends BaseData {
  abstract xmlCfg: BaseDataConfig;

  // valueForXML(self: any, key: string): string {
  //   return self;
  // }
}
