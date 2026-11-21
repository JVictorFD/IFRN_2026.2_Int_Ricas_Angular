import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TagModule } from '@openng/optimus-ui/tag';
import { ProdutoService } from '../../services/produto.service';
import { FiltroStatus, ProdutoStatsComponent } from '../produto-stats/produto-stats';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonModule, InputTextModule, TagModule, ProdutoStatsComponent],
  templateUrl: './produto-list.html',
})
export class ProdutoListComponent implements OnInit {
  readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  filtroStatus = signal<FiltroStatus>('todos');
  termoBusca = signal('');

  produtosFiltrados = computed(() => {
    const filtro = this.filtroStatus();
    const busca = this.termoBusca().trim().toLowerCase();

    return this.produtoService.produtos().filter((produto) => {
      const passaStatus =
        filtro === 'todos' ||
        (filtro === 'disponiveis' && produto.disponivel) ||
        (filtro === 'esgotados' && !produto.disponivel);

      const passaBusca = !busca || produto.nome.toLowerCase().includes(busca);
      return passaStatus && passaBusca;
    });
  });

  ngOnInit(): void {
    this.produtoService.listar().subscribe();
  }

  atualizarBusca(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.termoBusca.set(input.value);
  }

  irParaNovo(): void {
    this.router.navigate(['/produtos/novo']);
  }

  remover(id: number, nome: string): void {
    if (!confirm(`Deseja realmente excluir o produto "${nome}"?`)) {
      return;
    }

    this.produtoService.remover(id).subscribe();
  }
}
