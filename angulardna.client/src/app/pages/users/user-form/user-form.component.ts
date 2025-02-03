import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../models/user.model';

//PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
    providers: [MessageService]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isNew: boolean = true;
  user: User = { id: 0, nome: '', cpf: '', login: '', senha: '' };
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });

    const user = this.config.data?.user;
    if (user?.id > 0) {
      this.isNew = false;
      this.user = user
      this.userForm.patchValue(user);
    } else {
      this.isNew = true;
      this.user = { id: 0, nome: '', cpf: '', login: '', senha: '' };
      this.userForm.reset()
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (user.id) {
        this.userService.updateUser(user.id, user).subscribe(() => {
          this.ref.close();
        });
      } else {
        user.id = 0;
        this.userService.createUser(user).subscribe(() => {
          this.ref.close();
        });
      }
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}