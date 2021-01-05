import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {YearComponent} from '@/modules/calendar/year/year.component';
import {CalendarRoutingModule} from '@/modules/calendar/calendar-routing.module';
import {MaterialModule} from '@/material.module';
import {VisualsModule} from '@/visuals/visuals.module';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';

@NgModule({
  declarations: [YearComponent, MonthComponent, DayComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MaterialModule,
    VisualsModule
  ]
})
export class CalendarModule {
}
