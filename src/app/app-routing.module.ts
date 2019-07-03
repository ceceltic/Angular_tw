import { Routes } from '@angular/router';


export const rootRouterConfig: Routes = [
  {
    path: '',
    loadChildren: './views/quote/quote.module#QuoteModule',
  },
  {
    path: 'quote-compare',
    loadChildren: './views/quotecompare/quotecompare.module#QuotecompareModule',
  },
  {
    path: 'proposal',
    loadChildren: './views/proposal/proposal.module#ProposalModule',
  },
  {
    path: 'proposal-confirmation',
    loadChildren: './views/proposalconfirmation/proposalconfirmation.module#ProposalconfirmationModule',
  },
  {
    path: 'auth',
    loadChildren: './views/auth/auth.module#AuthModule',
  },
  {
    path: 'payment',
    loadChildren: './views/payment/payment.module#PaymentModule',
  },
 
  {
    path: '**',
    redirectTo: 'auth/404'
  }
];