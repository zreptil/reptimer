import {BaseDBData} from '@/_models/base-data';

export class PermissionInfos {
  edit = {title: $localize`Kalender ändern`, icon: 'edit'};
  add = {title: $localize`Kalender hinzufügen`, icon: 'add'};
  delete = {title: $localize`Kalender löschen`, icon: 'delete'};
  debug = {title: $localize`Debugfunktionalität nutzen`, icon: 'bug_report'};
  admin = {title: $localize`Administration aufrufen`, icon: 'admin_panel_settings'};
}

export class PermissionData {
  edit: boolean;
  add: boolean;
  delete: boolean;
  debug: boolean;
  admin: boolean;

  get addOrEdit(): boolean {
    return this.add || this.edit;
  }
}

export class UserData extends BaseDBData {
  fullname: string;
  isAuthorized: boolean;
  may: PermissionData;

  xmlCfg = {
    className: 'UserData'
  };

  static factory(): UserData {
    const ret = new UserData();
    ret.fullname = null;
    ret.isAuthorized = false;
    ret.may = new PermissionData();
    return ret;
  }

  create(): UserData {
    return UserData.factory();
  }
}

