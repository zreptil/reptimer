import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseControl} from '@/visuals/classes/base-control';
import {CPUFormGroup} from '@/core/classes/ibase-component';
import {GuardsCheckEnd, NavigationEnd, Router} from '@angular/router';
import {SessionService} from '@/_services/session.service';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {InitElementService} from '@/visuals/services/init-element.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatStepper} from '@angular/material/stepper';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    providers: [{
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false }
        }],
    standalone: false
})
export class NavBarComponent extends BaseControl implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label = '';
  @Input() formGroup: CPUFormGroup;
  @Input() formName: string;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;
  @Input() value: string;
  @Output() valueChange: EventEmitter<string>;
  @Input() items: ISelectItem[];
  navIdx: number;
  private baseUrl: string;

  constructor(private initElementService: InitElementService,
              public sessionService: SessionService,
              public router: Router) {
    super();
    this.baseUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
    console.log(this.router, this.baseUrl);
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
    this.setNavIdx();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setNavIdx();
      }
    });
    return {
      ...this.initElementService.initContext(this),
      value: this.value,
      items: this.items,
      skipOuterInner: true
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);
  }

  setNavIdx(): void {
    const check = this.router.url.substring(this.baseUrl.length);
    // check = check.substring(0, check.indexOf('/'));
    console.log(this.baseUrl, 'Checkov', check);
    // const check = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.navIdx = this.items.findIndex(n => n.value === check);
    if (this.stepper) {
      this.stepper.selectedIndex = this.navIdx;
    }
  }

  ngOnInit(): void {
  }

  stepChanged(idx: number): void {
    const item = this.items[idx];
    this.router.navigate([this.baseUrl, item.value]).then(success => {
      this.setNavIdx();
    });
  }
}

