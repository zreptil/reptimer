import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SplashScreenComponent} from '@/core/components/splash-screen/splash-screen.component';
import {DashboardComponent} from '@/modules/dashboard/dashboard.component';

const routes: Routes = [  // Default Route
  {
    path: 'calendar',
    loadChildren: () => import('./modules/calendar/calendar.module').then(m => m.CalendarModule)
  },
  {path: 'dashboard', component: DashboardComponent},
  {path: '**', component: SplashScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
