import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {CPUInvalidAndFocusSetter} from '@/visuals/classes/cpuinvalid-and-focus-setter';

@Component({
    selector: 'app-radio-group',
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.css'],
    standalone: false
})
export class RadioGroupComponent extends BaseControl implements OnInit, AfterViewInit, IComponentData {
  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  @Input() items: Iterable<ISelectItem>; // bei vorhandenen items & formGroup/formName wird der Wert von formGroup genommen
  // @Input()  id: string;

  private focusHandler = new CPUInvalidAndFocusSetter(() => this.widget.nativeElement, () => this.isValid(), () => this.renderer);

  get ctx(): any {
    // TODO(LyMe): versuch wg. validatoren und select-group
    const ctrl = this.formData;
    if (ctrl.items) {
      this.items = ctrl.items;
    }
    // TODO(LyMe) Ende
    return {
      ...this.initElementService.initContext(this),
      items: this.items
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  constructor(private initElementService: InitElementService,
              private widget: ElementRef,
              private renderer: Renderer2) {
    super();
    this.initElementService.setDefaultContext(this);
    this.items = [];
    this.outerClass = 'mat-form-field-appearance-outline';
    this.innerClass = 'mat-form-field-wrapper';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.focusHandler.afterViewInit();
  }

  private isValid(): boolean {
    // TODO(LyMe): beachte, es kann auch invalid value ausgewählt sein. Impelment This!
    const widget = this.widget.nativeElement;
    return !widget.querySelector('[ng-reflect-required="true"]') || widget.querySelector('mat-radio-button.mat-radio-checked');
  }

  public groupName(): string {
    return (this.formGroup.data[this.formName].label || '').replace(/\s+/g, '');
  }
}

