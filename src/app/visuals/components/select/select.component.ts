import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {SVData} from '@/_models/sv-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    standalone: false
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

  private cssClassInvalid = 'cpu-select-invalid-focus';

  constructor(private initElementService: InitElementService,
              private widget: ElementRef,
              private renderer: Renderer2) {
    super();
    this.initElementService.setDefaultContext(this);
    this.value = '';
    this.valueChange = new EventEmitter<string>();
    this.items = [];
  }

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

  ngOnInit(): void {
  }

  getInvalidFocusRoot(): any {
    return this.widget.nativeElement.querySelector('.mat-form-field-flex');
  }

  onFocus(): void {
    this.renderer.addClass(this.getInvalidFocusRoot(), this.cssClassInvalid);
  }

  onBlur(): void {
    this.renderer.removeClass(this.getInvalidFocusRoot(), this.cssClassInvalid);
  }
}

