import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';
import {Observable} from 'rxjs';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends BaseControl implements OnInit, IComponentData {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  @Input() value: string;
  @Output() valueChange: EventEmitter<string>;
  @Input() items: Array<ISelectItem>;

  filteredOptions: Observable<ISelectItem[]>;

  // constructor( @Inject(forwardRef(() => AppComponent)) private _parent:AppComponent)
  constructor(private initElementService: InitElementService) {
    super();
    this.value = '';
    this.valueChange = new EventEmitter<string>();
    this.items = [];
    this.initElementService.setDefaultContext(this);
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

  // Inject parent

  displayFn(entry: any): string {
    return entry && entry.label ? entry.label : '';
  }

  ngOnInit(): void {
    this.filteredOptions = this.formGroup.controls[this.formName].valueChanges
      .pipe(
        startWith(''),
        map(value => {
          console.log('items', this.items);
          return typeof value === 'string' ? value : (value as any).label;
        }),
        map(label => label ? this._filter(label) : this.items.slice())
      );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.items.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }
}
