import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../models/user.model';

//PrimeNG imports
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  dialogRef: any;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: User): void {
    this.dialogRef = this.dialogService.open(UserFormComponent, {
      header: 'Editar Usuário',
      modal: true,
      width: '50vw',
      data: {
        user: user,
      }
    });

    this.dialogRef.onClose.subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este usuário?',
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
        this.userService.deleteUser(id).subscribe(
          () => {
            this.loadUsers();
            this.messageService.add({ severity: 'info', summary: 'Usuário excluído com sucesso!', detail: 'Registro deletado' });
          },
          (error) => {
            console.error('Erro ao deletar usuário:', error);
          }
        );
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  newUser(): void {
    this.dialogRef = this.dialogService.open(UserFormComponent, {
      header: 'Novo Usuário',
      modal: true,
      width: '50vw',
      data: {
        user: null
      },
      breakpoints: {
        '960px': '75vw'
      }
    });

    this.dialogRef.onClose.subscribe(() => {
      this.loadUsers();
    });
  }
}