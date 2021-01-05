import {Component} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {GuardsCheckEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reptimer';

  constructor(public ss: SessionService,
              router: Router) {
    // Here we subscribe to the event for the routing, that always
    // fires, when the route changes. We need an event,
    // that contains the needed _loadedConfig for access to the
    // component connected to the route.
    router.events.subscribe(event => {
      if (event instanceof GuardsCheckEnd) {
        if (!event.shouldActivate) {
          return;
        }
        const url = event.urlAfterRedirects.replace(/\//, '');
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
}
