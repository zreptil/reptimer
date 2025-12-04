import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css'],
    standalone: false
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

  private cssClassInFocus = 'cpu-focus';

  constructor(private initElementService: InitElementService,
              private widget: ElementRef,
              private renderer: Renderer2) {
    super();
    this.initElementService.setDefaultContext(this);
    this.labelPosition = 'after';
  }

  ngOnInit(): void {
  }

  getFocusRoot(): any {
    return this.widget.nativeElement.querySelector('.inner');
  }

  onFocus(): void {
    this.renderer.addClass(this.getFocusRoot(), this.cssClassInFocus);
  }

  onBlur(): void {
    this.renderer.removeClass(this.getFocusRoot(), this.cssClassInFocus);
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

