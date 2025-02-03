import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../models/product.model';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  dialogRef: any;
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts()
    .subscribe(products => {
      this.products = products;
      this.loading = false;
    },
    (error) => {
        console.error('Erro ao carregar:', error);
        this.loading = false;
    });
  }

  editProduct(product: Product): void {
    this.dialogRef = this.dialogService.open(ProductFormComponent, {
      header: 'Editar Produto',
      modal: true,
      width: '50vw',
      data: {
        product: product,
      }
    });

    this.dialogRef.onClose.subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este produto?',
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
        this.productService.deleteProduct(id).subscribe(
          () => {
            this.loadProducts();
            this.messageService.add({ severity: 'info', summary: 'Produto excluído com sucesso!', detail: 'Registro deletado' });
          },
          (error) => {
            console.error('Erro ao deletar produto:', error);
          }
        );
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  newProduct(): void {
    this.dialogRef = this.dialogService.open(ProductFormComponent, {
      header: 'Novo Produto',
      modal: true,
      width: '50vw',
      data: {
        product: null
      },
      breakpoints: {
        '960px': '75vw'
      }
    });

    this.dialogRef.onClose.subscribe(() => {
      this.loadProducts();
    });
  }
}