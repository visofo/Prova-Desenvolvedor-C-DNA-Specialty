import { Customer } from "./customer.model";
import { Product } from "./product.model";
import { User } from "./user.model";

export interface Order {
    id: number;
    customerId: number;
    customer?: Customer;
    orderDate: Date;
    userId: number;
    user?: User;
    orderItems: OrderItem[];
    totalAmount: number;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    product?: Product;
    quantidade: number;
    itemPrice: number;
}