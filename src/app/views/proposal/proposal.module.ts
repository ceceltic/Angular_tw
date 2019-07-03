import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProposalRoutingModule } from './proposal-routing.module';
import { ProposalinputComponent } from './proposalinput/proposalinput.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';

@NgModule({
  declarations: [ProposalinputComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProposalRoutingModule),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module
  ]
})
export class ProposalModule { }
