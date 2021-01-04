import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {SVData} from '@/_models/sv-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends BaseControl implements OnInit, IComponentData {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() data: SVData;
  @Input() dataRef: any;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  // TODO: remove Input and Output from next three properties, when dataRef works
  @Input() value: string;
  @Output() valueChange: EventEmitter<string>;
  @Input() items: Iterable<ISelectItem>;

  get ctx(): any {
    const ctrl = this.formGroup.data[this.formName];
    if (ctrl.items) {
      this.value = ctrl.value;
      this.items = ctrl.items;
    }
    return {
      ...this.initElementService.initContext(this),
      value: this.value,
      items: this.items
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  constructor(private initElementService: InitElementService) {
    super();
    this.initElementService.setDefaultContext(this);
    this.value = '';
    this.valueChange = new EventEmitter<string>();
    this.items = [];
  }

  ngOnInit(): void {
  }
}
