import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent extends BaseControl implements AfterViewInit, OnInit, IComponentData {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  @ViewChild('widget') widget: any;

  get ctx(): any {
    return this.initElementService.initContext(this);
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  constructor(private initElementService: InitElementService) {
    super();
    this.initElementService.setDefaultContext(this);
  }

  dateModelToView(date: number): string {
    let ret: string = null;
    const match = ('' + date).match(/([0-9]{4})([0-9]{2})([0-9]{2})/);
    if (match && 4 === match.length) {
      ret = `${match[1]}-${match[2]}-${match[3]}`;
    }
    return ret;
  }

  dateViewToModel(value: string): number {
    let ret: number = null;
    if (!!value) {
      ret = Number.parseInt(('' + value).replace(/-/g, ''), 10);
    }
    return ret;
  }

  ngOnInit(): void {

    if (this.widget) {
      this.widget.nativeElement.value = this.dateModelToView(this.formGroup?.value[this.formName]);
    }
/*
    this.formGroup.valueChanges.subscribe(value => {
      if (value[this.formName]) {
        if (typeof (value[this.formName]) === 'string') {
          const stringValue = value[this.formName];
          const numberValue = this.dateViewToModel(stringValue);
          this.formGroup.get(this.formName).setValue(numberValue);
          this.widget.nativeElement.value = stringValue;
          }
        }
     });
     */
  }

  onFocusOut(e: any): void {
    if (this.formGroup?.get(this.formName).value) {
      if (typeof(this.formGroup?.get(this.formName).value) === 'string'){
        const stringValue = this.formGroup?.get(this.formName).value;
        const numberValue = this.dateViewToModel(stringValue);
        this.formGroup.get(this.formName).setValue(numberValue);
        this.widget.nativeElement.value = stringValue;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.widget) {
      this.widget.nativeElement.value = this.dateModelToView(this.formGroup?.value[this.formName]);
    }
  }

}
