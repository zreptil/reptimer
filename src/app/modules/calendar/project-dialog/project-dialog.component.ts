import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginData} from '@/_models/login-data';
import {DataService} from '@/_services/data.service';
import {MatDialogRef} from '@angular/material/dialog';
import {UserData} from '@/_models/user-data';
import {SessionService} from '@/_services/session.service';
import {CEM} from '@/_models/cem';
import {Md5} from 'ts-md5';
import {ISelectItem} from '@/visuals/model/iselectitem';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['../../../core/components/dialog/dialog.component.scss',
    './project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  public form: FormGroup;

  public data = {
    project: [null, Validators.required],
  };

  txtError: string;

  projectList = new Array<ISelectItem>();

  constructor(private ss: SessionService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ProjectDialogComponent>) {
    this.projectList = [{label: 'Testprojekt', value: '0'},
      {label: 'Kommunikation', value: '1'},
      {label: 'Woscht', value: '2'}];
  }

  ngOnInit(): void {
    this.form = this.fb.group(this.data);
  }

  saveClick(): void {
    this.data.project = this.form.get('project').value;
  }

  loginDone(): void {
    this.dialogRef.close();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }
}
