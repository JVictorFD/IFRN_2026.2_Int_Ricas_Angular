import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AuthService } from '../../services/auth.service';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, ButtonModule, InputTextModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  erroLogin = signal<string | null>(null);
  enviando = signal(false);

  loginModel = signal<LoginData>({
    email: 'admin@optimus.com',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'O e-mail é obrigatório.' });
    email(schemaPath.email, { message: 'Informe um e-mail válido.' });
    required(schemaPath.password, { message: 'A senha é obrigatória.' });
    minLength(schemaPath.password, 6, {
      message: 'A senha deve ter pelo menos 6 caracteres.',
    });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    this.erroLogin.set(null);

    if (!this.loginForm().valid()) {
      this.loginForm.email().markAsTouched();
      this.loginForm.password().markAsTouched();
      return;
    }

    this.enviando.set(true);
    this.authService.login(this.loginModel()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/produtos']);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erroLogin.set(err?.error?.mensagem ?? 'Falha ao autenticar. Verifique o backend.');
      },
    });
  }
}
