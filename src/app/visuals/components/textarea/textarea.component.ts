import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent extends BaseControl implements OnInit, IComponentData {
  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  get ctx(): any {
    return this.initElementService.initContext(this);
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  constructor(private initElementService: InitElementService) {
    super();
    this.initElementService.setDefaultContext(this);
    this.outerWidth = 4;
    this.innerWidth = 4;
  }

  ngOnInit(): void {
  }
}
