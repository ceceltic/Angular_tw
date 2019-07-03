import { Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FailureComponent } from './failure/failure.component';

export const PaymentRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: 'confirmation/:id',
    component: ConfirmationComponent,
    data: { title: "Login", breadcrumb: "" }
  },
    {
    path: 'failure/:id',
    component: FailureComponent,
    data: { title: "Login", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

