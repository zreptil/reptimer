import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '@/_services/session.service';
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
    name: ['', Validators.required],
    info: [],
    duration: []
  };

  txtError: string;
  maxDuration: number;

  projectList = new Array<ISelectItem>();

  constructor(private ss: SessionService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ProjectDialogComponent>) {
    this.projectList = [];
  }

  ngOnInit(): void {
    const names = {};
    for (const entry of this.ss.session.year.days) {
      for (const time of entry.times) {
        if (time.projects) {
          for (const proj of time.projects) {
            names[proj.name] = '';
          }
        }
      }
    }
    this.projectList = [];
    let idx = 0;
    Object.keys(names).forEach(key => {
      this.projectList.push({label: key, value: `${idx++}`});
    });

    this.data.duration[0] = this.ss.session.editProject.duration;
    this.data.info[0] = this.ss.session.editProject.info;
    this.data.name[0] = this.ss.session.editProject.name;

    this.maxDuration = this.ss.session.editTime.end - this.ss.session.editTime.start;
    console.log(this.ss.session.editTime, this.maxDuration);
    this.form = this.fb.group(this.data);
  }

  saveClick(): void {
    this.data.name = this.form.get('name').value;
    this.data.info = this.form.get('info').value;
    this.data.duration = this.form.get('duration').value;
  }

  loginDone(): void {
    this.dialogRef.close();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }
}
