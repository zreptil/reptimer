import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseControl implements OnInit, IComponentData {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  @Input() labelPosition: string;

  constructor(private initElementService: InitElementService) {
    super();
    this.initElementService.setDefaultContext(this);
    this.labelPosition = 'after';
  }

  ngOnInit(): void {
  }

  get ctx(): any {
    return {
      ...this.initElementService.initContext(this),
      labelPosition: this.labelPosition
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }
}
