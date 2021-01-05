import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {YearComponent} from '@/modules/calendar/year/year.component';

const routes: Routes = [
  {
    path: '',
    component: YearComponent,
    // children: [
    //   {path: 'edit', component: VorgangEditComponent}
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CalendarRoutingModule {
}
