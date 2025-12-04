import {Component, Input, OnInit} from '@angular/core';
import {ErrorService} from '@/_services/error.service';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    standalone: false
})
export class ErrorComponent implements OnInit {
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;

  constructor(public es: ErrorService) {
  }

  ngOnInit(): void {
  }

}

