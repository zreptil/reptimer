import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '@/_services/session.service';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {TimeData} from '@/_models/time-data';
import {ControlObject, CPUFormGroup} from '@/core/classes/ibase-component';
import {ComponentService} from '@/_services/component.service';
import {AppBaseComponent} from '@/core/classes/app-base-component';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['../../../core/components/dialog/dialog.component.scss',
    './project-dialog.component.scss']
})
export class ProjectDialogComponent extends AppBaseComponent implements OnInit {
  controls = {
    name: {
      label: $localize`Name`,
      items: [{label: 'oleole', value: 'hurz'}]
    },
    info: {
      label: $localize`Info`
    },
    duration: {
      label: $localize`Dauer`,
      max: 0
    }
  };

  txtError: string;
  maxDuration: number;

  projectList = new Array<ISelectItem>();

  constructor(public ss: SessionService,
              public cs: ComponentService,
              public dialogRef: MatDialogRef<ProjectDialogComponent>) {
    super(ss, cs);
    this.projectList = [];
  }

  durationDisplay(value: any): string {
    return TimeData.timeForDisplay(value);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const names = {};
    for (const entry of this.ss.calendar.days) {
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



    // this.data.duration[0] = this.ss.session.editProject.duration;
    // this.data.info[0] = this.ss.session.editProject.info;
    // this.data.name[0] = this.ss.session.editProject.name;
    // this.data.name[0] = 'Oleole';

    this.maxDuration = this.ss.session.editTime.end - this.ss.session.editTime.start;
    console.log(this.ss.session.editTime, this.maxDuration);
//    this.form = this.fb.group(this.data) as CPUFormGroup;
  }

  saveClick(): void {
    // this.data.name = this.form.get('name').value;
    // this.data.info = this.form.get('info').value;
    // this.data.duration = this.form.get('duration').value;
  }

  loginDone(): void {
    this.dialogRef.close();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  readFromSession(): any {
    return {
      name: 'Namenstestinhalt',
      info: 'Infotestinhalt',
      duration: 10
    };
  }

  async writeToSession(data: any): Promise<boolean> {
    return Promise.resolve(false);
  }
}
