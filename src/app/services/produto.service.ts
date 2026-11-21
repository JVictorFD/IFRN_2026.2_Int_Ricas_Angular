import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Produto } from '../models/produto';

@Service()
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/produtos';

  private readonly _produtos = signal<Produto[]>([]);
  private readonly _carregando = signal(false);
  private readonly _erro = signal<string | null>(null);

  readonly produtos = this._produtos.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly erro = this._erro.asReadonly();

  readonly totalProdutos = computed(() => this._produtos().length);
  readonly totalDisponiveis = computed(
    () => this._produtos().filter((produto) => produto.disponivel).length
  );
  readonly totalEsgotados = computed(
    () => this._produtos().filter((produto) => !produto.disponivel).length
  );

  listar() {
    this._carregando.set(true);
    this._erro.set(null);

    return this.http.get<Produto[]>(this.apiUrl).pipe(
      tap((lista) => {
        this._produtos.set(lista);
        this._carregando.set(false);
      }),
      catchError((err) => {
        this._carregando.set(false);
        this._erro.set('Não foi possível carregar os produtos da API.');
        return throwError(() => err);
      })
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: Omit<Produto, 'id'>) {
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      tap((criado) => {
        this._produtos.update((lista) => [...lista, criado]);
      })
    );
  }

  atualizar(id: number, produto: Omit<Produto, 'id'>) {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      tap((atualizado) => {
        this._produtos.update((lista) =>
          lista.map((item) => (item.id === id ? atualizado : item))
        );
      })
    );
  }

  remover(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._produtos.update((lista) => lista.filter((item) => item.id !== id));
      })
    );
  }
}
