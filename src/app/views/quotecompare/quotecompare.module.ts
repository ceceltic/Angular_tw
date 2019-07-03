import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { QuotecompareRoutingModule } from './quotecompare-routing.module';
import { PremiumListComponent } from './premium-list/premium-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PremiumListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(QuotecompareRoutingModule)
  ]
})
export class QuotecompareModule { }