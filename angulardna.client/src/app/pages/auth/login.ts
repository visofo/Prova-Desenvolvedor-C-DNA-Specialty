import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div>
                            <label for="user" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario</label>
                            <input pInputText id="user" type="text" placeholder="Insira seu usuário" class="w-full md:w-[30rem] mb-8" [(ngModel)]="user" />

                            <label for="senha" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                            <p-password id="senha" [(ngModel)]="senha" placeholder="senha" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <!-- <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div> -->
                            <p-button label="Logar" styleClass="w-full" (click)="login()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    user: string = '';
    senha: string = '';
    checked: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    login() {
        this.authService.login(this.user, this.senha).subscribe(
            success => {
                if (success) {
                    this.router.navigate(['/']);
                } else {
                    // Handle login failure
                }
            },
            error => {
                // Handle error
            }
        );
    }
}