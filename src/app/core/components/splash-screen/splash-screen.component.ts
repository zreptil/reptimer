import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ComponentService} from '@/_services/component.service';
import {AppBaseComponent} from '@/core/classes/app-base-component';
import {ControlObject} from '@/core/classes/ibase-component';
import {SessionService} from '@/_services/session.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent extends AppBaseComponent implements AfterViewInit {
  controls: ControlObject = {};

  constructor(public ss: SessionService,
              public cs: ComponentService) {
    super(ss, cs);
  }

  readFromSession(): any {
  }

  async writeToSession(data: any): Promise<boolean> {
    return Promise.resolve(false);
  }

  ngAfterViewInit(): void {
    this.ss.titleInfo = 'Lade Daten...';
  }
}
