import { Component, computed, input, model, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Produto } from '../../models/produto';

export type FiltroStatus = 'todos' | 'disponiveis' | 'esgotados';

@Component({
  selector: 'app-produto-stats',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './produto-stats.html',
})
export class ProdutoStatsComponent {
  // Input Signal (Pai -> Filho)
  produtos = input.required<Produto[]>();

  // Model Signal (Two-way binding Pai <-> Filho)
  filtroAtivo = model<FiltroStatus>('todos');

  // Output Signal (Filho -> Pai)
  novoProduto = output<void>();

  // Computed Signals derivados do input()
  total = computed(() => this.produtos().length);
  disponiveis = computed(() => this.produtos().filter((p) => p.disponivel).length);
  esgotados = computed(() => this.produtos().filter((p) => !p.disponivel).length);

  selecionarFiltro(filtro: FiltroStatus): void {
    this.filtroAtivo.set(filtro);
  }
}
