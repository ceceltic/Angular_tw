import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutingModule),
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
