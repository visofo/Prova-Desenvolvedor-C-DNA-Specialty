import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../../../models/order.model';
import { OrderService } from '../../service/order.service';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../service/customer.service';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../service/product.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

//PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';


@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        InputNumberModule,
        TableModule,
        ToastModule,
        FluidModule
    ],
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.scss'],
    providers: [MessageService]
})
export class OrderFormComponent implements OnInit { 
    orderForm!: FormGroup;
    customers: Customer[] = [];
    products: Product[] = [];
    order: Order = {
        id: 0,
        customerId: 0,
        orderDate: new Date(),
        userId: 1,
        orderItems: [],
        totalAmount: 0
    };

    constructor(
        private orderService: OrderService,
        private customerService: CustomerService,
        private productService: ProductService,
        private fb: FormBuilder,
        private messageService: MessageService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) { }

    ngOnInit(): void {
        this.loadCustomers();
        this.loadProducts();
        this.buildForm();
        if(this.config.data?.order){
            this.order = this.config.data.order;
            this.patchForm()
        }
    }

     patchForm(){
         this.orderForm.patchValue({
            customerId: this.order.customerId
         })
         this.order.orderItems.forEach(item => {
            this.addItem(item.productId, item.quantidade)
         });
    }

    buildForm() {
        this.orderForm = this.fb.group({
            customerId: ['', Validators.required],
            items: this.fb.array([])
        });
    }

    loadCustomers() {
        this.customerService.getCustomers().subscribe(
            (data) => {
                this.customers = data;
            },
            (error) => {
                console.error('Erro ao carregar clientes:', error);
                 this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar clientes.' });
            }
        );
    }

    loadProducts() {
        this.productService.getProducts().subscribe(
            (data) => {
                this.products = data;
            },
            (error) => {
                console.error('Erro ao carregar produtos:', error);
                  this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produtos.' });
            }
        );
    }


    addItem(productId: number | null = null, quantity: number = 0) {
        const items = this.orderForm.get('items') as FormArray;
        items.push(this.fb.group({
            productId: [productId ? productId : null , Validators.required],
            quantity: [quantity ? quantity : 0 , Validators.required]
        }));

    }
    removeItem(index: number) {
        const items = this.orderForm.get('items') as FormArray;
        items.removeAt(index);
    }

    calculateTotal() {
        let total = 0;
        const items = this.orderForm.get('items')?.value;

        if (items) {
           items.forEach((item: any) => {
                 const product = this.products.find(p => p.id == item.productId)
                  if(product){
                    total += product.preco * item.quantity
                  }
               })
             this.order.totalAmount = total;
        }
       return total
    }

    saveOrder() {

        if (this.orderForm.valid) {
            const formValue = this.orderForm.value;
            this.order.customerId = formValue.customerId
            this.order.orderItems = formValue.items;
           this.orderService.createOrder(this.order).subscribe(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido criado com sucesso.' });
                    this.closeDialog();
                },
                (error) => {
                    console.error('Erro ao criar pedido:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar pedido.' });
                }
            );
        }
        else {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos corretamente.' });
        }
    }

    closeDialog() {
         this.ref.close();
    }

    get itemsControls() {
      return (this.orderForm.get('items') as FormArray)?.controls || [];
  }
}