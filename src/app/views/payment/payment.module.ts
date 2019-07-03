import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PaymentRoutingModule } from './payment-routing.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FailureComponent } from './failure/failure.component';

@NgModule({
  declarations: [ConfirmationComponent, FailureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PaymentRoutingModule),
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PaymentModule { }
