import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, Usuario } from '../models/auth';

const TOKEN_KEY = 'optimus_jwt_token';
const USER_KEY = 'optimus_user';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _usuario = signal<Usuario | null>(this.carregarUsuarioSalvo());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(credenciais: LoginRequest) {
    return this.http.post<LoginResponse>('/api/auth/login', credenciais).pipe(
      tap((resposta) => {
        localStorage.setItem(TOKEN_KEY, resposta.token);
        localStorage.setItem(USER_KEY, JSON.stringify(resposta.usuario));
        this._token.set(resposta.token);
        this._usuario.set(resposta.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  private carregarUsuarioSalvo(): Usuario | null {
    const salvo = localStorage.getItem(USER_KEY);
    if (!salvo) {
      return null;
    }

    try {
      return JSON.parse(salvo) as Usuario;
    } catch {
      return null;
    }
  }
}
