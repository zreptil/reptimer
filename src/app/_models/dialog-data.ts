import {ControlObject, IFormControl} from '@/core/classes/ibase-component';

export enum DialogResultButton {
  none = -1,
  ok,
  cancel,
  yes,
  no,
  abort
}

export enum DialogType {
  confirm,
  info,
  debug
}

export class DialogResult {
  btn: DialogResultButton;
  data?: any;
}

export interface IDialogButton {
  title: string;
  result: DialogResult;
  focus?: boolean;
}

export interface IDialogDef {
  title: string;
  buttons: IDialogButton[];
}

export class DialogData {
  result: DialogResult;
  title: string | string[] | ControlObject;
  buttons: IDialogButton[];
  controlListInternal: IFormControl[] = null;
  private defs = new Map<DialogType, IDialogDef>([
    [DialogType.info, {
      title: $localize`Information`,
      buttons: [
        {title: $localize`Ok`, result: {btn: DialogResultButton.ok}}
      ]
    }
    ],
    [DialogType.debug, {
      title: $localize`Debug Meldung`,
      buttons: [
        {title: $localize`Ok`, result: {btn: DialogResultButton.ok}}
      ]
    }
    ],
    [DialogType.confirm, {
      title: $localize`Bestätigung`,
      buttons: [
        {title: $localize`Nein`, result: {btn: DialogResultButton.no}},
        {title: $localize`Ja`, result: {btn: DialogResultButton.yes}, focus: true}
      ]
    }
    ]
  ]);

  constructor(public type: DialogType | IDialogDef,
              public content: string | string[] | ControlObject,
              public ownButtons?: IDialogButton[]) {
    if (typeof type === 'number') {
      this.buttons = this.defs.get(type).buttons;
      this.title = this.defs.get(type).title;
    } else {
      this.buttons = type.buttons;
      this.title = type.title;
    }
  }

  get controlList(): IFormControl[] {
    if (!this.controlListInternal) {
      this.controlListInternal = [];
      if (typeof this.controls !== 'string' && !Array.isArray(this.controls)) {
        Object.keys(this.controls).forEach(key => {
          this.controls[key].key = key;
          this.controlListInternal.push(this.controls[key]);
        });
      }
    }
    return this.controlListInternal;
  }

  get controls(): ControlObject {
    if (Array.isArray(this.content)) {
      if (this.content.length === 0 || typeof this.content[0] === 'string') {
        return {};
      }
    }
    return this.content as ControlObject;
  }

  get display(): string[] {
    if (Array.isArray(this.content)) {
      if (this.content.length > 0) {
        if (typeof this.content[0] === 'string') {
          return this.content as string[];
        }
      }
      return [];
    }
    return [typeof this.content === 'string' ? this.content : null];
  }
}
