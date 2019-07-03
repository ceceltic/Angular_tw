import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteinputComponent } from './quoteinput/quoteinput.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [QuoteinputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(QuoteRoutingModule),
    NgSelectModule,
 ]
})
export class QuoteModule { }
