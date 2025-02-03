import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

//PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    FluidModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  providers: [MessageService]
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  customer: Customer = { id: 0, cnpj: '', razaoSocial: '' };
  isNew: boolean = true;


  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {

  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: [0],
      cnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required]
    });

    const customer = this.config.data?.customer;
    if (customer?.id > 0) {
      this.isNew = false;
      this.customer = customer
      this.customerForm.patchValue(customer);
    } else {
      this.isNew = true;
      this.customer = { id: 0, cnpj: '', razaoSocial: '' };
      this.customerForm.reset()
    }

  }


  saveCustomer() {
    if (this.customerForm.valid) {
      const customer = this.customerForm.value;

      if (this.isNew) {
        customer.id = 0;
        this.customerService.createCustomer(customer).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente criado com sucesso.' });
            this.closeDialog();
          },
          (error) => {
            console.error('Erro ao criar cliente:', error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar cliente.' });
          }
        );
      } else {
        this.customerService.updateCustomer(this.customer.id, customer).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso.' });
            this.closeDialog();
          },
          (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cliente.' });
          }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos corretamente.' });
    }

  }
  closeDialog() {
    this.ref.close();
  }

}