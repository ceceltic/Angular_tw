import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app-routing.module';
import { AppComponent } from './app.component';
import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



//import { SelectDropDownModule } from 'ngx-select-dropdown'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    Select2Module,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    //SelectDropDownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
