import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SplashScreenComponent} from '@/core/components/splash-screen/splash-screen.component';

const routes: Routes = [  // Default Route
  {path: '**', component: SplashScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
