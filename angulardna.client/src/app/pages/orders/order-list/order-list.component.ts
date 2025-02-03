import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

//PrimeNG imports
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../service/order.service';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        InputTextModule
    ],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    providers: [DialogService, MessageService]
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];
    loading: boolean = true;
    dialogRef!: DynamicDialogRef;
    ref: DynamicDialogRef | undefined;

    constructor(
        private orderService: OrderService,
        private dialogService: DialogService,
         public messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders() {
        this.loading = true;
        this.orderService.getOrders().subscribe(
            (data) => {
                this.orders = data;
                this.loading = false;
            },
            (error) => {
                console.error('Erro ao carregar pedidos:', error);
                this.loading = false;
                 this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos.' });
            }
        );
    }

     editOrder(order: Order) {
         this.dialogRef = this.dialogService.open(OrderFormComponent, {
            header: 'Editar Pedido',
             modal:true,
            width: '70vw',
            data: {
               order : order
            },
              breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
        });

       this.dialogRef.onClose.subscribe(() => {
          this.loadOrders();
        });
    }


    deleteOrder(id: number) {
        this.orderService.deleteOrder(id).subscribe(
            () => {
                this.loadOrders();
            },
            (error) => {
                console.error('Erro ao deletar pedido:', error);
                  this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar pedido.' });
            }
        );
    }

    newOrder() {

         this.dialogRef = this.dialogService.open(OrderFormComponent, {
            header: 'Novo Pedido',
             modal:true,
            width: '70vw',
              breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
        });

        this.dialogRef.onClose.subscribe(() => {
           this.loadOrders();
        });
    }
}