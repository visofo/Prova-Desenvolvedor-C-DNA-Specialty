import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { RouterModule } from '@angular/router';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';

//PrimeNG imports
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-customer-list',
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
        ConfirmDialogModule,
        ToastModule
    ],
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    providers: [DialogService, MessageService, ConfirmationService]
})
export class CustomerListComponent implements OnInit {
    customers: Customer[] = [];
    loading: boolean = true;
    dialogRef!: DynamicDialogRef;

    constructor(
        private customerService: CustomerService,
        private dialogService: DialogService,
        public messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers() {
        this.loading = true;
        this.customerService.getCustomers().subscribe(
            (data) => {
                this.customers = data;
                this.loading = false;
            },
            (error) => {
                console.error('Erro ao carregar clientes:', error);
                this.loading = false;
            }
        );
    }


    editCustomer(customer: Customer) {
        this.dialogRef = this.dialogService.open(CustomerFormComponent, {
            header: 'Editar Cliente',
            width: '50vw',
            data: {
                customer: customer,
            }
        });

        this.dialogRef.onClose.subscribe(() => {
            this.loadCustomers();
        });
    }

    deleteCustomer(event: Event, id: number): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Você tem certeza que deseja excluir este cliente?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Deletar',
                severity: 'danger',
            },
            accept: () => {
                this.customerService.deleteCustomer(id).subscribe(
                    () => {
                        this.loadCustomers();
                        // alert('Cliente excluído com sucesso!');
                        this.messageService.add({ severity: 'info', summary: 'Cliente excluído com sucesso!', detail: 'Registro deletado' });
                    },
                    (error) => {
                        console.error('Erro ao deletar cliente:', error);
                    }
                );
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            },
        });
    }

    newCustomer() {
        this.dialogRef = this.dialogService.open(CustomerFormComponent, {
            header: 'Novo Cliente',
            modal: true,
            width: '50vw',
            data: {
                customer: null
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });

        this.dialogRef.onClose.subscribe(() => {
            this.loadCustomers();
        });
    }
}