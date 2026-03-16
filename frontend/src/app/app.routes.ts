import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutComponent } from './shared/layout/layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'medicines', pathMatch: 'full' },
      {
        path: 'medicines',
        loadComponent: () => import('./features/medicines/medicine-catalog/medicine-catalog').then(m => m.MedicineCatalogComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customer-management/customer-management').then(m => m.CustomerManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/order-cart/order-cart').then(m => m.OrderCartComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payment-screen/payment-screen').then(m => m.PaymentScreenComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'medicines' }
];
