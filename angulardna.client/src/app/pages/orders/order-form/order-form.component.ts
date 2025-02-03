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
        clienteId: 0,
        cliente: {} as Customer,
        orderDate: new Date(),
        userId: 1,
        itensPedido: [],
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
            cliente: this.order.cliente
         })
         this.order.itensPedido.forEach(item => {
            this.addItem(item.produto, item.quantidade)
         });
    }

    buildForm() {
        this.orderForm = this.fb.group({
            cliente: ['', Validators.required],
            itens: this.fb.array([])
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

    addItem(produto: Product | null = null, quantity: number = 0) {
        const items = this.orderForm.get('itens') as FormArray;
        items.push(this.fb.group({
            produto: [produto ? produto : null , Validators.required],
            quantidade: [quantity ? quantity : 0 , Validators.required]
        }));

    }
    
    removeItem(index: number) {
        const items = this.orderForm.get('itens') as FormArray;
        items.removeAt(index);
    }

    calculateTotal() {
        let total = 0;
        const items = this.orderForm.get('itens')?.value;

        if (items) {
           items.forEach((item: any) => {
                 const product = this.products.find(p => p.id == item.produto?.id)
                  if(product){
                    total += product.preco * item.quantidade
                  }
               })
             this.order.totalAmount = total;
        }
       return total
    }

    saveOrder() {

        if (this.orderForm.valid) {
            const formValue = this.orderForm.value;
            this.order.clienteId = formValue.cliente.id;
            formValue.itens.forEach((item: { produto: any; quantidade: any; preco: any; })=> {
                this.order.itensPedido.push({
                    id: 0,
                    orderId: 0,
                    produtoId: item.produto.id,
                    quantidade: item.quantidade,
                    itemPrice: item.preco
            });
        });

            //this.order.itens = formValue.itens;
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
      return (this.orderForm.get('itens') as FormArray)?.controls || [];
  }
}