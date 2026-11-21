# AppRicas

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Optimus Inventory (App Ricas)

Aplicação web desenvolvida com **Angular 22**, **OptimusUI 2** e **Tailwind CSS 4**, integrada a uma API REST em Node.js/Express com **autenticação JWT**.

## Recursos implementados
- **Signals (`signal`, `computed`)** para gerenciamento reativo de estado
- **Comunicação entre componentes com Signals** (`input()`, `output()`, `model()`)
- **Services (`@Service()` e `inject()`)** para estado global e comunicação HTTP
- **Signal Forms (`@angular/forms/signals`)** com validação nas telas de login, cadastro e edição
- **Rotas e Route Guard (`authGuard`)** protegendo todas as telas privadas
- **HttpClient + HttpInterceptor (`authInterceptor`)** anexando `Authorization: Bearer <token>`
- **Backend REST + CORS + Middleware JWT** protegendo os endpoints `/api/produtos`

## Como executar

## 1. Instale as dependências do frontend e do backend:
```bash
npm install
npm --prefix backend install
```
---

## 2. Checklist de testes antes do commit
Faça um teste rápido clicando em tudo na aba da porta `4200` para garantir que nenhum requisito da avaliação falhe:

1. **Proteção de rota (Guard):** Clique em **Sair**, tente digitar `/produtos` direto na URL e confirme que o `authGuard` te joga de volta para `/login`.
2. **Validação com Signal Forms:** Na tela de login, apague o e-mail ou digite uma senha curta e confirme se as mensagens de erro aparecem e o botão fica desabilitado.
3. **Login + JWT:** Entre com `admin@optimus.com` / `123456` e confirme o redirecionamento para `/produtos`.
4. **Comunicação via Signals:** Clique nos 3 cards de estatísticas (`Total`, `Disponíveis`, `Em falta`) e confirme se a tabela filtra em tempo real (`ProdutoStatsComponent` ↔ `ProdutoListComponent`).
5. **CRUD completo na API:**
   * Clique em **+ Novo produto**, teste a validação de nome curto, salve um produto novo e veja ele aparecer na lista.
   * Clique em **Detalhar** para abrir `/produtos/:id`.
   * Clique em **Editar** para abrir `/produtos/:id/editar`, altere um campo e salve.
   * Clique em **Excluir** e confirme a remoção.
6. **Proteção do Backend (prova do JWT):** Rode no terminal:
   ```bash
   curl -i http://localhost:3000/api/produtos
   ```