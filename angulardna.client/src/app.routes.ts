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
import { UserListComponent } from './app/pages/users/user-list/user-list.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // { path: '', component: Dashboard },
            // { path: 'register', component: RegisterComponent },
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
            { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] },
            { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
            { path: 'customers/detail/:id', component: CustomerFormComponent, canActivate: [AuthGuard] },
            { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard] },
            { path: 'orders/detail/:id', component: OrderFormComponent, canActivate: [AuthGuard] },
            { path: 'orders/create', component: OrderFormComponent, canActivate: [AuthGuard] },
        ]
    },
    { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
