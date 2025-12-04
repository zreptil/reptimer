import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ErrorService} from '@/_services/error.service';

@Component({
    selector: 'app-error-display',
    templateUrl: './error-display.component.html',
    styleUrls: ['./error-display.component.css'],
    standalone: false
})
export class ErrorDisplayComponent implements OnInit {

  constructor(public es: ErrorService,
              private bottomSheetRef: MatBottomSheetRef<ErrorDisplayComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public config: any) {
  }

  ngOnInit(): void {
    this.es.controlForm.form.valueChanges.subscribe(value => {
      this.close();
    });
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}

