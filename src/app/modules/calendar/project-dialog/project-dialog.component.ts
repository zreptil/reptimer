import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '@/_services/session.service';
import {TimeData} from '@/_models/time-data';
import {ComponentService} from '@/_services/component.service';
import {AppBaseComponent} from '@/core/classes/app-base-component';
import {ProjectData} from '@/_models/project-data';

@Component({
    selector: 'app-project-dialog',
    templateUrl: './project-dialog.component.html',
    styleUrls: ['../../../core/components/dialog/dialog.component.css',
        './project-dialog.component.css'],
    standalone: false
})
export class ProjectDialogComponent extends AppBaseComponent implements OnInit {
  txtError: string;
  maxDuration: number;

  controls = {
    name: {
      label: $localize`Name`,
      items: null,
      value: ''
    },
    info: {
      label: $localize`Info`,
      value: ''
    },
    duration: {
      label: $localize`Dauer`,
      value: 0
    }
  };

  constructor(public ss: SessionService,
              public cs: ComponentService,
              public dialogRef: MatDialogRef<ProjectDialogComponent>) {
    super(ss, cs);
    this.fillControls();
  }

  durationDisplay(value: any): string {
    return TimeData.timeForDisplay(+value);
  }

  fillControls(): void {
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
    const list = [];
    Object.keys(names).forEach(key => {
      list.push({label: key, value: key});
    });
    this.controls.name.items = list;
    this.maxDuration = this.ss.session.editTime.end - this.ss.session.editTime.start;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  saveClick(): void {
    this.cs.writeSessionData(this);
    this.dialogRef.close();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  readFromSession(): any {
    return {
      name: this.ss.session.editProject.name,
      info: this.ss.session.editProject.info,
      duration: this.ss.session.editProject.duration === 0 ? this.maxDuration : this.ss.session.editProject.duration
    };
  }

  writeToSession(data: any): boolean {
    if (data.name?.value) {
      data.name = data.name.value;
    }
    if (!this.ss.session.editTime.projects) {
      this.ss.session.editTime.projects = [];
    }
    const idx = this.ss.session.editProject.idx;
    if (idx < 0) {
      this.ss.session.editTime.projects.push(ProjectData.CEM.classify(data));
    } else {
      this.ss.session.editTime.projects[idx] = ProjectData.CEM.classify(data);
    }
    return true;
  }
}

