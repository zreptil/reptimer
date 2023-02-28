import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SplashScreenComponent} from '@/core/components/splash-screen/splash-screen.component';
import {DashboardComponent} from '@/modules/calendar/dashboard/dashboard.component';
import {AdminPageComponent} from '@/modules/users/admin-page/admin-page.component';

const routes: Routes = [  // Default Route
  {
    path: 'calendar',
    loadChildren: () => import('./modules/calendar/calendar.module').then(m => m.CalendarModule)
  },
  {path: 'dashboard', component: DashboardComponent},
  {path: '_-~-_', component: AdminPageComponent},
  {path: '**', component: SplashScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
