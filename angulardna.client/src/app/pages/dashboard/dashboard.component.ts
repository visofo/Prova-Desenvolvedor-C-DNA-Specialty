import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { OrderService } from '../service/order.service';
import { CustomerService } from '../service/customer.service';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';
import { Customer } from '../../models/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BestSellingWidget } from './components/bestsellingwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { StatsWidget } from './components/statswidget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    StatsWidget
  ],
  template: `
  <div class="grid grid-cols-12 gap-8">
      <app-stats-widget [users]="users"
  [products]="products"
  [orders]="orders"
  [customers]="customers" class="contents" />
      <div class="col-span-12 xl:col-span-6">
          <!-- <app-recent-sales-widget />
          <app-best-selling-widget /> -->
      </div>
      <div class="col-span-12 xl:col-span-6">
          <!-- <app-revenue-stream-widget />
          <app-notifications-widget /> -->
      </div>
  </div>
`,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  customers: Customer[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
    this.loadCustomers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }
}