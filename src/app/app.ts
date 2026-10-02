import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from './models/produto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Array que armazenará os dados em memória
  produtos: Produto[] = [];
  
  // Controle de estado para o formulário
  produtoAtual: Produto = this.novoProduto();
  modoEdicao: boolean = false;

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
  }

  // READ (Detalhar)
  detalhar(id: number): void {
    const encontrado = this.produtos.find(p => p.id === id); 
    if (encontrado) {
      this.produtoAtual = { ...encontrado };
      this.modoEdicao = true;
    }
  }

  // DELETE
  remover(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id); 
  }
}