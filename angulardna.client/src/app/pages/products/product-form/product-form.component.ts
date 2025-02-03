import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

//PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        InputNumberModule,
        ToastModule,
        FluidModule
    ],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    providers: [MessageService]
})
export class ProductFormComponent implements OnInit {
    productForm!: FormGroup;
    product: Product = { id: 0, nome: '', preco: 0 };
    isNew: boolean = true;


    constructor(
         private productService: ProductService,
        private fb: FormBuilder,
        private messageService: MessageService,
         public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {

    }

    ngOnInit(): void {

        this.productForm = this.fb.group({
            id: [0],
            nome: ['', Validators.required],
            preco: [0, Validators.required]
        });

        const product = this.config.data?.product;

          if (product?.id > 0) {
              this.isNew = false;
              this.product = product
              this.productForm.patchValue(product);
          } else {
              this.isNew = true;
             this.product = { id: 0, nome: '', preco: 0 };
               this.productForm.reset()
          }
    }


    saveProduct() {
        if (this.productForm.valid) {
            const product = this.productForm.value;

            if (this.isNew) {
                product.id = 0;
                this.productService.createProduct(product).subscribe(
                    () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado com sucesso.' });
                        this.closeDialog();
                    },
                    (error) => {
                        console.error('Erro ao criar produto:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar produto.' });
                    }
                );
            } else {
                this.productService.updateProduct(this.product.id, product).subscribe(
                    () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso.' });
                         this.closeDialog();
                    },
                    (error) => {
                        console.error('Erro ao atualizar produto:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar produto.' });
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