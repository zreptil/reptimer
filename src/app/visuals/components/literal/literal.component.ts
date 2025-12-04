import {Component, Input, OnInit} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';

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
    selector: 'app-literal',
    templateUrl: './literal.component.html',
    styleUrls: ['./literal.component.css'],
    standalone: false
})
export class LiteralComponent implements OnInit, IComponentData {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  // Wenn sowohl value als auch formGroup/formName existieren, wird value genommen
  @Input() value: string;

  get ctx(): any {
    return {...this.initElementService.initContext(this), value: this.value};
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  // Inject parent
  // constructor( @Inject(forwardRef(() => AppComponent)) private _parent:AppComponent)
  constructor(private initElementService: InitElementService) {
    this.initElementService.setDefaultContext(this);
    this.value = null;
  }

  ngOnInit(): void {
  }

}

