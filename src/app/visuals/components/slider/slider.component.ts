import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';

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
  @Input() max: number;
  @Input() min: number;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  // Wenn sowohl value als auch formGroup/formName existieren, wird value genommen
  @Input() value: string;

  get ctx(): any {
    return this.initElementService.initContext(this);
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  // Inject parent
  // constructor( @Inject(forwardRef(() => AppComponent)) private _parent:AppComponent)
  constructor(private initElementService: InitElementService) {
    super();
    this.min = 0;
    this.max = 100;
    this.initElementService.setDefaultContext(this);
  }

  ngOnInit(): void {
  }
}
