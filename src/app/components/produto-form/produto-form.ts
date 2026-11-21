import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ProdutoService } from '../../services/produto.service';

interface ProdutoFormData {
  nome: string;
  quantidade: number;
  dataFabricacao: string;
  disponivel: boolean;
}

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [RouterLink, FormField, ButtonModule, InputTextModule],
  templateUrl: './produto-form.html',
})
export class ProdutoFormComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  produtoId = signal<number | null>(null);
  modoEdicao = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);

  produtoModel = signal<ProdutoFormData>({
    nome: '',
    quantidade: 0,
    dataFabricacao: new Date().toISOString().slice(0, 10),
    disponivel: true,
  });

  produtoForm = form(this.produtoModel, (schemaPath) => {
    required(schemaPath.nome, { message: 'O nome do produto é obrigatório.' });
    minLength(schemaPath.nome, 3, { message: 'O nome deve ter no mínimo 3 caracteres.' });
    min(schemaPath.quantidade, 0, { message: 'A quantidade não pode ser negativa.' });
    required(schemaPath.dataFabricacao, { message: 'Informe a data de fabricação.' });
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.produtoId.set(id);
      this.modoEdicao.set(true);

      this.produtoService.buscarPorId(id).subscribe({
        next: (produto) => {
          this.produtoModel.set({
            nome: produto.nome,
            quantidade: produto.quantidade,
            dataFabricacao: String(produto.dataFabricacao).slice(0, 10),
            disponivel: produto.disponivel,
          });
        },
        error: () => {
          this.erro.set('Produto não encontrado para edição.');
        },
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.erro.set(null);

    if (!this.produtoForm().valid()) {
      this.produtoForm.nome().markAsTouched();
      this.produtoForm.quantidade().markAsTouched();
      this.produtoForm.dataFabricacao().markAsTouched();
      return;
    }

    this.salvando.set(true);
    const dados = this.produtoModel();
    const id = this.produtoId();

    const requisicao$ =
      this.modoEdicao() && id !== null
        ? this.produtoService.atualizar(id, dados)
        : this.produtoService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/produtos']);
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Não foi possível salvar o produto. Verifique a conexão com a API.');
      },
    });
  }
}
