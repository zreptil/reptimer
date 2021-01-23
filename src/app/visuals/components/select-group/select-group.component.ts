import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {SVData} from '@/_models/sv-data';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {MatListOption} from '@angular/material/list';
import {CPUInvalidAndFocusSetter} from '@/visuals/classes/cpuinvalid-and-focus-setter';


@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss']
})
export class SelectGroupComponent extends BaseControl implements OnInit, AfterViewInit, IComponentData {
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
  selectedOptions: any;

  private focusHandler = new CPUInvalidAndFocusSetter(() => this.widget.nativeElement, () => this.isStateValid(), () => this.renderer);


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
    const ctrl = this.formData;
    if (ctrl.items) {
      this.items = ctrl.items;
      this.value = ctrl.value;
    }
    return {
      ...this.initElementService.initContext(this),
      items: this.items,
      value: this.value
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  ngOnInit(): void {
  }

  selectionChanged(option: MatListOption): void {
    //console.log(option.selected);
  }

  ngAfterViewInit(): void {
    this.focusHandler.afterViewInit();
  }

  private isStateValid(): boolean {
    let ret = false;
    // wäre schön gewesen, wenn der Validator für SelectGroup funktioniert hätte...
    if (this.widget.nativeElement.querySelector('mat-selection-list[ng-reflect-required="true"]')) {
      ret = !!this.widget.nativeElement.querySelector('[ng-reflect-state="checked"]');
    } else {
      ret = true;
    }
    return ret;
  }

}
