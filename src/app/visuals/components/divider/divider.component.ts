import {Component, Input, OnInit} from '@angular/core';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
    selector: 'app-divider',
    templateUrl: './divider.component.html',
    styleUrls: ['./divider.component.css'],
    standalone: false
})
export class DividerComponent extends BaseControl implements OnInit {

  @Input() level = 2;
  @Input() label = '';
  @Input() formGroup: CPUFormGroup;
  @Input() formName: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.level < 1 || this.level > 6) {
      this.level = 2;
    }
  }
}

