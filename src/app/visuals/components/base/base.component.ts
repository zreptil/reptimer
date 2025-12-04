import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ShowDebugInfoService} from '@/visuals/services/show-debug-info.service';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css'],
    standalone: false
})
export class BaseComponent implements OnInit {
  @Input()
  componentsTemplate: TemplateRef<any>;
  @Input()
  childContext: any = {};

  public formattedMessage = '';

  constructor(private showDebugInfoService: ShowDebugInfoService) {
  }

  ngOnInit(): void {
    if (!this.childContext) {
      this.childContext = {};
    }

    this.childContext = {
      outerWidth: 1,
      innerWidth: 1,
      outerClass: null,  /* TODO(LyMe) propagieren */
      innerClass: null,  /* TODO(LyMe) propagieren */
      label: '',
      formName: '',
      formGroup: null,
      alwaysShowDebugInfo: true,
      ...this.childContext
    };

    if (this.childContext.formGroup !== null &&
      this.childContext.formGroup !== undefined &&
      this.childContext.formName !== null &&
      this.childContext.formName !== undefined) {
      const ctrl = this.childContext.formGroup.get(this.childContext.formName);
      if (ctrl != null) {
        ctrl.valueChanges.subscribe(val => {
          if (this.childContext.control.onValueChanges) {
            this.childContext.control.onValueChanges(val);
          }
          setTimeout(() => {
              this.formattedMessage = `My name is ${val}.`;
            }, 10000
          );
        });
      } else {
        console.error(`${this.childContext.formName} wurde nicht gefunden`);
      }
    }
  }

  showDebug(): boolean {
    return this.childContext &&
      (this.childContext.alwaysShowDebugInfo || this.showDebugInfoService.showDebugInfoOnClient());
  }

}

