import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { AuthGuard } from './app/guards/auth.guard';
import { CustomerFormComponent } from './app/pages/customers/customer-form/customer-form.component';
import { CustomerListComponent } from './app/pages/customers/customer-list/customer-list.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { OrderFormComponent } from './app/pages/orders/order-form/order-form.component';
import { OrderListComponent } from './app/pages/orders/order-list/order-list.component';
import { ProductFormComponent } from './app/pages/products/product-form/product-form.component';
import { ProductListComponent } from './app/pages/products/product-list/product-list.component';
import { UserFormComponent } from './app/pages/users/user-form/user-form.component';
import { UserListComponent } from './app/pages/users/user-list/user-list.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductListComponent },
            { path: 'customers', component: CustomerListComponent },
            { path: 'users', component: UserListComponent },
            { path: 'customers/detail/:id', component: CustomerFormComponent },
            { path: 'orders', component: OrderListComponent },
            { path: 'orders/detail/:id', component: OrderFormComponent },
            { path: 'orders/create', component: OrderFormComponent },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: 'login' }
];