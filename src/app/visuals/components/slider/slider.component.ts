import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';
import {MatSliderChange} from '@angular/material/slider';

/**
 * CPU-eigenes Custom Form Control, der die Darstellung von Zeichenketten / Literalen kapselt.
 *
 * @example
 * Zeige Text, dessen Label im Code übersetzt wird (aus dem labels.notizen) und der Wert aus dem formGroup.
 * <app-literal [label]="labels.notizen" formName="notizen" [formGroup]="form"></app-literal>
 *
 * @example
 * Zeige Text mit dem Wert ohne formGroup; kein Label erforderlich.
 * Da der Wert in der HTML-Datei fest gesetzt wird,
 * wird der Hinweis auf die Übersetzugn erforderlich,
 * daher "i18n-value" um anzuzeigen, dass "value" übersetzt werden soll:
 * <app-literal label="" i18n-value value="Some value to be processed and {{rep.laced}} if needed"></app-literal>
 *
 */
export declare type LabelFn = (value: any) => string;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends BaseControl implements OnInit, IComponentData {
  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() max = 100;
  @Input() min = 0;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  @Input() labelFunc: LabelFn;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;
  display: string;

  // constructor( @Inject(forwardRef(() => AppComponent)) private _parent:AppComponent)
  constructor(private initElementService: InitElementService) {
    super();
    this.initElementService.setDefaultContext(this);
  }

  get ctx(): any {
    return this.initElementService.initContext(this);
  }

  // Inject parent

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  // get display(): string {
  //   if (this.labelFunc) {
  //     return this.labelFunc(this.formGroup?.controls[this.formName].value);
  //   }
  //   return this.formData?.label;
  // }

  get displayLabel(): any {
    if (this.labelFunc) {
      return this.labelFunc;
    }
    return (value) => this.formData?.label;
  }

  ngOnInit(): void {
    this.showValue(this.formData?.value);
  }

  showValue(value: number): void {
    if (this.labelFunc) {
      this.display = this.labelFunc(+value);
      return;
    }
    this.display = value + '';
  }

  onSliderMove($event: MatSliderChange): void {
    this.showValue($event.value);
  }
}
