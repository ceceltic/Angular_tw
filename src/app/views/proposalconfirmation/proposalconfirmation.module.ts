import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProposalconfirmationRoutingModule } from './proposalconfirmation-routing.module';
import { ProposalconfirmationdisplayComponent } from './proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';

@NgModule({
  declarations: [ProposalconfirmationdisplayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProposalconfirmationRoutingModule),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module
  ]
})
export class ProposalconfirmationModule { }
