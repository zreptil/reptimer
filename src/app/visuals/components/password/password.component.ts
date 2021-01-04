import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent extends BaseControl implements OnInit, IComponentData {

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
  }

  ngOnInit(): void {
  }

}
