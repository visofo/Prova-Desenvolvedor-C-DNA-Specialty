import { Customer } from "./customer.model";
import { Product } from "./product.model";
import { User } from "./user.model";

export interface Order {
    id: number;
    clienteId: number;
    cliente?: Customer;
    orderDate: Date;
    userId: number;
    user?: User;
    itensPedido: OrderItem[];
    totalAmount: number;
}

export interface OrderItem {
    id: number;
    orderId: number;
    produtoId: number;
    produto?: Product;
    quantidade: number;
    itemPrice: number;
}