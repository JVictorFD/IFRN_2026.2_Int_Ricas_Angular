import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from './services/auth.service';
import { ProdutoService } from './services/produto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  readonly authService = inject(AuthService);
  readonly produtoService = inject(ProdutoService);

  readonly iniciaisUsuario = computed(() => {
    const nome = this.authService.usuario()?.nome ?? 'US';
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  });

  sair(): void {
    this.authService.logout();
  }
}
