export interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  dataFabricacao: Date | string;
  disponivel: boolean;
}
