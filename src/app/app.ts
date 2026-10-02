import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TagModule } from '@openng/optimus-ui/tag';
import { Produto } from './models/produto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule, TagModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Array que armazenará os dados em memória
  produtos: Produto[] = [];
  
  // Controle de estado para o formulário
  produtoAtual: Produto = this.novoProduto();
  modoEdicao: boolean = false;
  formularioAberto: boolean = true;

  get produtosDisponiveis(): number {
    return this.produtos.filter(produto => produto.disponivel).length;
  }

  get produtosEsgotados(): number {
    return this.produtos.filter(produto => !produto.disponivel).length;
  }

  novoProduto(): Produto {
    return { id: 0, nome: '', dataFabricacao: new Date(), disponivel: true };
  }

  // CREATE / UPDATE
  salvar(): void {
    if (this.modoEdicao) {
      const index = this.produtos.findIndex(p => p.id === this.produtoAtual.id);
      if (index !== -1) {
        this.produtos[index] = { ...this.produtoAtual };
      }
      this.modoEdicao = false;
    } else {
      this.produtoAtual.id = new Date().getTime(); // ID gerado na hora
      this.produtos.push({ ...this.produtoAtual }); // Adiciona ao final
    }
    this.produtoAtual = this.novoProduto();
    this.formularioAberto = false;
  }

  // READ (Detalhar)
  detalhar(id: number): void {
    const encontrado = this.produtos.find(p => p.id === id); 
    if (encontrado) {
      this.produtoAtual = { ...encontrado };
      this.modoEdicao = true;
      this.formularioAberto = true;
    }
  }

  abrirNovoProduto(): void {
    this.produtoAtual = this.novoProduto();
    this.modoEdicao = false;
    this.formularioAberto = true;
  }

  cancelarEdicao(): void {
    this.produtoAtual = this.novoProduto();
    this.modoEdicao = false;
    this.formularioAberto = false;
  }

  // DELETE
  remover(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id); 
  }
}