import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDialogComponent} from '@/modules/users/admin-page/user-dialog/user-dialog.component';
import {MaterialModule} from '@/material.module';
import {VisualsModule} from '@/visuals/visuals.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginDialogComponent} from '@/modules/users/login-dialog/login-dialog.component';
import {AdminPageComponent} from '@/modules/users/admin-page/admin-page.component';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    UserDialogComponent,
    LoginDialogComponent,
    AdminPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    BrowserModule,
    VisualsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule {
}
