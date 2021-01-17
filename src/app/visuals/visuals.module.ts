import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InputTextComponent} from './components/input-text/input-text.component';
import {MaterialModule} from '@/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import { DividerComponent } from './components/divider/divider.component';
import { NewlineComponent } from './components/newline/newline.component';
import { SelectComponent } from './components/select/select.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NumberComponent } from './components/number/number.component';
import { DateComponent } from './components/date/date.component';
import { PasswordComponent } from './components/password/password.component';
import { BaseComponent } from './components/base/base.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ColorComponent } from './components/color/color.component';
import { DateTimeLocalComponent } from './components/date-time-local/date-time-local.component';
import { EmailComponent } from './components/email/email.component';
import { MonthComponent } from './components/month/month.component';
import { SearchComponent } from './components/search/search.component';
import { TelephoneComponent } from './components/telephone/telephone.component';
import { TimeComponent } from './components/time/time.component';
import { UrlComponent } from './components/url/url.component';
import { WeekComponent } from './components/week/week.component';
import { LiteralComponent } from './components/literal/literal.component';
import { ErrorComponent } from './components/error/error.component';
import { TableComponent } from './components/table/table.component';
import { SelectGroupComponent } from './components/select-group/select-group.component';
import { MarginComponent } from './components/margin/margin.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { PercentComponent } from './components/percent/percent.component';
import {AutocompleteComponent} from '@/visuals/components/autocomplete/autocomplete.component';
import {SliderComponent} from '@/visuals/components/slider/slider.component';


@NgModule({
  declarations: [
    AutocompleteComponent,
    InputTextComponent,
    DividerComponent,
    NewlineComponent,
    SelectComponent,
    RadioGroupComponent,
    CheckboxComponent,
    NumberComponent,
    DateComponent,
    PasswordComponent,
    BaseComponent,
    TextareaComponent,
    ColorComponent,
    DateTimeLocalComponent,
    EmailComponent,
    MonthComponent,
    SearchComponent,
    TelephoneComponent,
    TimeComponent,
    UrlComponent,
    WeekComponent,
    LiteralComponent,
    ErrorComponent,
    TableComponent,
    SelectGroupComponent,
    MarginComponent,
    CurrencyComponent,
    PercentComponent,
    SliderComponent
  ],
  exports: [
    InputTextComponent,
    DividerComponent,
    NewlineComponent,
    SelectComponent,
    RadioGroupComponent,
    CheckboxComponent,
    NumberComponent,
    DateComponent,
    PasswordComponent,
    TextareaComponent,
    ColorComponent,
    DateTimeLocalComponent,
    EmailComponent,
    MonthComponent,
    SearchComponent,
    TelephoneComponent,
    TimeComponent,
    UrlComponent,
    WeekComponent,
    LiteralComponent,
    TableComponent,
    SelectGroupComponent,
    MarginComponent,
    CurrencyComponent,
    PercentComponent,
    AutocompleteComponent,
    SliderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class VisualsModule { }
