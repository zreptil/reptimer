import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogResultButton} from '@/_models/dialog-data';
import {SessionService} from '@/_services/session.service';
import {DialogComponent} from '@/core/components/dialog/dialog.component';
import {AdminUserData} from '@/_models/admin-user-data';
import {PermissionInfos} from '@/_models/user-data';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['../../../../core/components/dialog/dialog.component.css',
        './user-dialog.component.css'],
    standalone: false
})
export class UserDialogComponent implements OnInit {
  form: UntypedFormGroup;
  permissionList: any;
  data: { [k: string]: any };

  permissions = new PermissionInfos();

  constructor(private fb: UntypedFormBuilder,
              public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public user: AdminUserData,
              public ss: SessionService) {
    this.data = {};
    this.data.username = user.username;
    this.data.fullname = user.fullname;
    this.data.isAuthorized = user.isAuthorized;
    this.permissionList = [];
    Object.keys(this.permissions).forEach(key => {
      const entry = {
        key,
        value: user.may[key],
        title: this.permissions[key].title
      };
      this.permissionList.push(entry);
      if (this.user.id === this.ss.session.cfg.authorization && key === 'admin') {
        this.data[key] = {value: entry.value, disabled: true};
      } else if (this.user.id === '' && key === 'read') {
        this.data[key] = {value: entry.value, disabled: true};
      } else {
        this.data[key] = entry.value;
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group(this.data);
  }

  saveClick(): void {
    console.log('vorher', JSON.parse(JSON.stringify(this.user)));
    this.user.username = this.form.get('username').value;
    this.user.fullname = this.form.get('fullname').value;
    this.user.isAuthorized = this.data.isAuthorized;
    for (const key of Reflect.ownKeys(this.permissions)) {
      if (!(key as string).endsWith('Title')) {
        this.user.may[key] = this.form.get(key as string).value;
      }
    }
    console.log('nachher', JSON.parse(JSON.stringify(this.user)));
    this.dialogRef.close('save');
  }

  deleteClick(): void {
    this.ss.confirm($localize`Soll der Benutzer ${this.user.fullname} wirklich gelöscht werden?`).subscribe(result => {
      if (result.btn === DialogResultButton.yes) {
        this.dialogRef.close('delete');
      }
    });
  }
}

