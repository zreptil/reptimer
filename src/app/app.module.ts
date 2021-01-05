import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from './material.module';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogComponent} from '@/core/components/dialog/dialog.component';
import {ErrorDisplayComponent} from '@/core/components/error-display/error-display.component';
import {AppRoutingModule} from '@/app-routing.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {VisualsModule} from '@/visuals/visuals.module';

import { SplashScreenComponent } from './core/components/splash-screen/splash-screen.component';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';

import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de-DE');

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'  /* alternativ: fill */
};

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    ErrorDisplayComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // Material Design
    MaterialModule,

    // Routing Module
    AppRoutingModule,
    VisualsModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
