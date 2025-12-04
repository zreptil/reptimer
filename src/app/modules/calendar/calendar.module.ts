import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {YearComponent} from '@/modules/calendar/year/year.component';
import {CalendarRoutingModule} from '@/modules/calendar/calendar-routing.module';
import {MaterialModule} from '@/material.module';
import {VisualsModule} from '@/visuals/visuals.module';
import {MonthComponent} from './month/month.component';
import {DayComponent} from './day/day.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProjectDialogComponent} from '@/modules/calendar/project-dialog/project-dialog.component';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    YearComponent,
    MonthComponent,
    DayComponent,
    DashboardComponent,
    ProjectDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    VisualsModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule {
}
