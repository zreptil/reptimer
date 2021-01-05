import {AfterViewInit, Component} from '@angular/core';
import {ComponentService} from '@/_services/component.service';
import {AppBaseComponent} from '@/core/classes/app-base-component';
import {ControlObject} from '@/core/classes/ibase-component';
import {SessionService} from '@/_services/session.service';
import {YearData} from '@/_models/year-data';
import {Router} from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent extends AppBaseComponent {
  controls: ControlObject = {};

  constructor(ss: SessionService,
              public cs: ComponentService,
              private router: Router) {
    super(ss, cs);
  }

  readFromSession(): any {
  }

  async writeToSession(data: any): Promise<boolean> {
    return Promise.resolve(false);
  }
}
