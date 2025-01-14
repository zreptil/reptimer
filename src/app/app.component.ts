import {Component} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {GuardsCheckEnd, Router} from '@angular/router';
import {DialogResultButton, IDialogButton} from '@/_models/dialog-data';
import {CEM} from '@/_models/cem';
import {PermissionInfos, UserData} from '@/_models/user-data';
import {LoginDialogComponent} from '@/modules/users/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '@/_services/data.service';
import {EnvironmentService} from '@/_services/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reptimer';

  constructor(public ss: SessionService,
              public dialog: MatDialog,
              public ds: DataService,
              public env: EnvironmentService,
              private router: Router) {
    ds.get(CEM.User, 'userinfo').subscribe((data: UserData) => {
      ss.setUser(data);
    }, _err => {
      this.ss.confirm($localize`Beim Zugriff auf den Server ist ein Fehler aufgetreten.
Das liegt vermutlich daran, dass das Zertifikat des Servers nicht käuflich erworben wurde.
Wenn Du die Speicherung der Daten auf dem Server zur Verfügung haben möchtest, dann
kannst Du das tun, indem Du im Browser auf der Webseite des Servers die Berechtigung
zum Zugriff erteilst. Soll die Webseite des Servers aufgerufen werden, damit Du dort die
Berechtigung erteilen kannst?`).subscribe(result => {
        if (result.btn === DialogResultButton.yes) {
          window.open(`${env.apiUrl}`, '_blank');
        }
      });
    });
    // Here we subscribe to the event for the routing, that always
    // fires, when the route changes. We need an event,
    // that contains the needed _loadedConfig for access to the
    // component connected to the route.
    router.events.subscribe(event => {
      if (event instanceof GuardsCheckEnd) {
        if (!event.shouldActivate) {
          return;
        }
        // const url = event.urlAfterRedirects.replace(/\//, '');
        // Since it is not really possible to get information about the
        // current route beyond the url, we have to implement a somewhat
        // hacky solution to access the private member _loadedConfig.
        // Maybe this changes in future versions so that this hack is not
        // usable, but up to now it is the only solution, that gives us
        // the control over the navigation, that we need.
        //
        // The information how to do this was taken from here:
        // https://github.com/angular/angular/issues/24069
        //
        // NOTTODO: find a less hacky way to do this (maybe there is a better way in future versions of angular)
        // this is the way
        let cfg = event.state.root.firstChild.routeConfig as any;
        if (cfg._loadedConfig) {
          const pos = event.urlAfterRedirects.substr(1).indexOf('/');
          cfg = cfg._loadedConfig.routes[0];
          if (pos >= 0) {
            const path = event.urlAfterRedirects.substr(pos + 2);
            cfg = cfg.children.find(c => c.path === path);
          }
        }
        this.ss.titleInfo = 'Reptimer';
//        this.ss.ws.activate(event.urlAfterRedirects);
        this.ss.servicebar = [];
        let servicebar = null;
        // const key = this.ss.ws.current.servicebar;
        // if (key) {
        //   servicebar = this.ss.servicebarDefs.get(key);
        // }
        if (cfg != null) {
          if (cfg.component?.servicebar != null) {
            servicebar = cfg.component.servicebar;
          }
        }
        if (servicebar != null) {
          this.ss.extractServicebar(servicebar);
        }
      }
    });
  }

  get logoLink(): string {
    switch (this.router.url) {
      case '/dashboard':
        return 'calendar';
    }
    return 'dashboard';
  }

  get permissionList(): any[] {
    const ret = [];
    const list = new PermissionInfos();
    Object.keys(list).forEach(key => {
      ret.push({icon: list[key].icon, may: this.ss.session.user.may[key]});
    });
    return ret;
  }

  debugClick(): void {
    this.ss.session.cfg.isDebug = !this.ss.session.cfg.isDebug;
    this.ss.saveSession();
  }

  accountClick(): void {
    if (this.ss.session.user.isAuthorized) {
      const btnList = new Array<IDialogButton>(
        {title: $localize`Nein`, result: {btn: DialogResultButton.no}},
        {title: $localize`Ja`, result: {btn: DialogResultButton.yes}, focus: true}
      );
      let title = $localize`Willst Du Dich abmelden?`;
      if (this.ss.session.user.may.admin) {
        btnList.splice(0, 0, {title: $localize`Admin`, result: {btn: -1, data: 'admin'}});
        title += $localize` Du kannst auch die Administration aufrufen.`;
      }
      this.ss.showDialog({title: $localize`Bestätigung`, buttons: btnList}, title).subscribe(result => {
        switch (result.btn as any) {
          case DialogResultButton.yes:
            this.ss.session.cfg.authorization = null;
            this.ss.session.user = UserData.factory();
            this.ss.saveSession();
            this.ds.get(CEM.User, 'userinfo').subscribe((data: UserData) => {
              this.ss.setUser(data);
            });
            break;
          case -1:
            this.router.navigate(['/_-~-_']);
            break;
        }
      });
      return;
    }
    const dialogRef = this.dialog.open(LoginDialogComponent).afterClosed();
    dialogRef.subscribe(_result => {
    });
  }
}
