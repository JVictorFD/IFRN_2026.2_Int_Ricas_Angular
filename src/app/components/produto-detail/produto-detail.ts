import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TagModule } from '@openng/optimus-ui/tag';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonModule, TagModule],
  templateUrl: './produto-detail.html',
})
export class ProdutoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly produtoService = inject(ProdutoService);

  produto = signal<Produto | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.produtoService.buscarPorId(id).subscribe({
      next: (encontrado) => {
        this.produto.set(encontrado);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Produto não encontrado.');
        this.carregando.set(false);
      },
    });
  }

  remover(): void {
    const item = this.produto();
    if (!item || !confirm(`Deseja realmente excluir "${item.nome}"?`)) {
      return;
    }

    this.produtoService.remover(item.id).subscribe({
      next: () => this.router.navigate(['/produtos']),
    });
  }
}
