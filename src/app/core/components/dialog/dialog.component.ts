import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData, IDialogButton} from '@/_models/dialog-data';
import {ComponentService} from '@/_services/component.service';
import {ControlObject, CPUFormGroup, FormConfig, IBaseComponent} from '@/core/classes/ibase-component';
import {ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements IBaseComponent, OnInit {
  @ViewChild('formDirective') formDirective;
  cfg = new FormConfig();
  controls: ControlObject;
  form?: CPUFormGroup;
  formValidaitors?: ValidatorFn | ValidatorFn[];
  readData: any;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              private cs: ComponentService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.controls = data.controls;
  }

  ngOnInit(): void {
    this.cs.init(this);
    this.cs.readSessionData(this);
  }

  closeDialog(btn: IDialogButton): any {
    this.cs.writeSessionData(this);
    btn.result.data = this.readData;
    this.dialogRef.close(btn.result);
  }

  async writeToSession(data: any): Promise<boolean> {
    this.cs.setValuesToFormData(this);
    return true;
  }

  readFromSession(): any {
    const ret = {};
    Object.keys(this.controls).forEach(key => {
      ret[key] = this.form.get(key).value;
    });
    return ret;
  }

  saveSession(): void {
  }

  setSessionComponent(): void {
  }

  transferServicebarControls(): any {
  }

  activateControl(formName: string): void {
  }

  debug(id: string, key: string, ...optionalParams: any[]): void {
  }
}
