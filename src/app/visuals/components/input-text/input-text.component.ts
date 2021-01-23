import {Component, Input, OnInit} from '@angular/core';
// import {AppComponent} from '@/app.component';
// import {ShowDebugInfoService} from '@/visuals/services/show-debug-info.service';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {BaseControl} from '@/visuals/classes/base-control';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  /*
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
  */
})
export class InputTextComponent extends BaseControl implements OnInit, IComponentData/*, ControlValueAccessor*/ /*, AfterViewInit*/ {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

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

  ngOnInit(): void {
  }

  /*  wird zumindest beim Verwenden von FormGroup/FormControl eh nie aufgerufen
  // BEGIN ControlValueAccessor
  propagateChange = (_: any) => {};
  propagateTouched = (_: any) => {};

  registerOnChange(fn: any): void {
    if (fn !== null && fn !== undefined) {
      this.propagateChange = fn;
    }
  }

  registerOnTouched(fn: any): void {
    if (fn !== null && fn !== undefined){
      this.propagateTouched = fn;
    }
  }

  writeValue(value: any): void {
    console.log(`*** writeValue: ${value}`);
    if (value !== undefined) {
      //this.value = value;
      this.propagateChange(value);
      this.propagateTouched(value);
    }
  }*/
  // End ControlValueAccessor

  /*
    ngAfterViewInit(): void {
      console.warn('***** ola!!!');
      console.dir(this);

      const ngControl: NgControl = this.injector.get(NgControl, null);
      console.dir(ngControl);
      if (ngControl) {
        const x = ngControl.control as FormControl;
        this.formControl = x;
        console.warn('[[[***');
        console.dir(x);
        console.warn( ']]]');
        console.error(`**** formControlName: ${x.value}`);
      } else {
        // Component is missing form control binding
      }

      console.warn('[[[[');
      console.dir(this);
      console.warn(']]]]');
    }
   */
}
