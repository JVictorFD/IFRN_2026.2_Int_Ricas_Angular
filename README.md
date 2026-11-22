# Optimus Inventory (App Ricas)

Aplicação web SPA (*Single Page Application*) para gestão de inventário de produtos, desenvolvida como projeto prático da disciplina **Interfaces Ricas** (TADS 2026.2 — IFRN).

O sistema implementa um CRUD completo de produtos em **Angular 22**, utilizando **Signals**, **Comunicação entre Componentes**, **Services**, **Signal Forms**, **Rotas com Route Guard**, **HttpClient com Interceptor**, **API REST em Node.js/Express** e **Autenticação JWT**.

---

## Tecnologias Utilizadas

### Frontend
- **Angular 22** (`^22.2.0`) — Arquitetura standalone, Signals, Signal Forms, Router e HttpClient
- **TypeScript** (`~6.0.2`) e **RxJS** (`~7.8.0`)
- **OptimusUI 2** (`@openng/optimus-ui ^2.0.2` e tema `Aura`) — Componentes visuais (`p-button`, `pInputText`, `p-tag`)
- **Tailwind CSS 4** (`^4.3.3` via `@tailwindcss/postcss`) — Estilização utilitária, responsividade e ajustes específicos em componentes OptimusUI e elementos HTML

### Backend (API REST)
- **Node.js** (ES Modules) + **Express 5** (`^5.1.0`)
- **CORS** (`^2.8.5`) — Controle de acesso entre origens distintas
- **JSON Web Token** (`jsonwebtoken ^9.0.2`) — Geração e validação de tokens JWT

---

## Estrutura do Repositório

```text
├── backend/
│   ├── package.json                       # Dependências da API REST
│   └── server.js                          # Servidor Express com CRUD, CORS e middleware JWT
├── proxy.conf.json                        # Proxy de /api para http://localhost:3000
├── .postcssrc.json                        # Configuração do plugin @tailwindcss/postcss (Tailwind 4)
├── package.json                           # Dependências e scripts do frontend Angular
└── src/
    ├── styles.css                         # Importação global do Tailwind (@import 'tailwindcss')
    └── app/
        ├── app.config.ts                  # Providers globais (Router, HttpClient + Interceptor, OptimusUI)
        ├── app.routes.ts                  # Definição de rotas públicas, privadas e wildcard
        ├── app.ts / app.html              # Layout principal (sidebar, topbar, logout e <router-outlet />)
        ├── models/
        │   ├── produto.ts                 # Interface Produto (id, nome, quantidade, dataFabricacao, disponivel)
        │   └── auth.ts                    # Interfaces de login, resposta e usuário
        ├── services/
        │   ├── produto.service.ts         # Estado reativo (Signals) + operações CRUD via HttpClient
        │   └── auth.service.ts            # Login, logout, armazenamento do token e estado de autenticação
        ├── guards/
        │   └── auth.guard.ts              # Proteção de rotas privadas no frontend (CanActivateFn)
        ├── interceptors/
        │   └── auth.interceptor.ts        # Anexa Authorization: Bearer <token> e trata HTTP 401
        └── components/
            ├── login/                     # Tela de login com Signal Forms
            ├── produto-stats/             # Cards de métricas e filtros (comunicação via Signals)
            ├── produto-list/              # Listagem, busca, filtros e ações do CRUD
            ├── produto-form/              # Cadastro e edição com Signal Forms e validações
            └── produto-detail/            # Visualização detalhada do produto (/produtos/:id)
```

---

## Arquitetura e Explicação dos Recursos

1. **Model (`src/app/models/produto.ts`):**
   Define a interface `Produto` contemplando os tipos obrigatórios: `id` (`number`), `nome` (`string`), `quantidade` (`number`), `dataFabricacao` (`Date | string`) e `disponivel` (`boolean`).

2. **Signals e Estado Reativo:**
   O estado da lista de produtos, carregamento, erros e sessão do usuário é gerenciado com `signal()`, e os valores derivados (total de itens, disponíveis, esgotados e iniciais do usuário) são recalculados automaticamente com `computed()`.

3. **Decomposição e Comunicação entre Componentes com Signals:**
   A interface foi dividida em componentes menores. A comunicação entre o componente pai (`ProdutoListComponent`) e o filho (`ProdutoStatsComponent`) usa as APIs baseadas em Signals:
   - `input.required<Produto[]>()` — recebe a lista de produtos do pai;
   - `model<FiltroStatus>('todos')` — *two-way binding* para sincronizar o filtro ativo ao clicar nos cards;
   - `output<void>()` — emite o evento de criação de novo produto para o pai navegar para `/produtos/novo`.

4. **Services (`@Service()` e `inject()`):**
   - `ProdutoService` (`src/app/services/produto.service.ts`): centraliza o estado dos produtos e todas as requisições `GET`, `POST`, `PUT` e `DELETE` via `HttpClient`, utilizando operadores RxJS (`tap` e `catchError`).
   - `AuthService` (`src/app/services/auth.service.ts`): autentica via `POST /api/auth/login`, armazena o token JWT e expõe o signal computado `isAuthenticated`.

5. **Signal Forms (`@angular/forms/signals`):**
   Utilizado nas telas de **Login** (`login.ts`), **Cadastro** e **Edição** (`produto-form.ts`). Emprega `form()` sobre um signal de modelo, diretiva `[formField]` nos inputs e validadores reativos (`required`, `email`, `minLength`, `min`) exibindo mensagens de erro por campo.

6. **Rotas e Proteção no Frontend (`authGuard`):**
   Configuradas em `src/app/app.routes.ts` e registradas via `provideRouter(routes)` em `src/app/app.config.ts`:
   - `/login` — Rota pública de acesso.
   - `/produtos` — Listagem protegida (`canActivate: [authGuard]`).
   - `/produtos/novo` — Cadastro protegido (`canActivate: [authGuard]`).
   - `/produtos/:id` — Detalhamento protegido com leitura do parâmetro via `ActivatedRoute`.
   - `/produtos/:id/editar` — Edição protegida com carregamento do item pelo `:id`.
   - `''` e `'**'` — Redirecionamentos automáticos.

   Caso um usuário sem autenticação tente acessar qualquer rota de `/produtos`, o `authGuard` redireciona imediatamente para `/login`.

7. **Comunicação com Backend, `HttpInterceptor` e Proteção JWT:**
   - `authInterceptor` (`src/app/interceptors/auth.interceptor.ts`) intercepta todas as chamadas do `HttpClient` e injeta o cabeçalho `Authorization: Bearer <token>`. Em respostas `401 Unauthorized`, executa logout automático.
   - No backend (`backend/server.js`), o middleware `autenticarJWT` valida a assinatura do token com `jwt.verify()` em todas as rotas `/api/produtos`, bloqueando acessos sem token válido com `HTTP 401`.
   - O arquivo `proxy.conf.json` encaminha requisições `/api` do Angular (`:4200`) para o Express (`:3000`), evitando problemas de CORS no ambiente local e no GitHub Codespaces.
   - *Nota de segurança:* o token é armazenado em `localStorage` para fins didáticos; em produção, recomenda-se preferir cookies `HttpOnly` (`Secure` e `SameSite`) ou tokens de curta duração mantidos apenas em memória para mitigar riscos de XSS.

---

## Endpoints da API (`backend/server.js`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | Pública | Autentica o usuário e retorna token JWT |
| `GET` | `/api/produtos` | Bearer JWT | Lista todos os produtos |
| `GET` | `/api/produtos/:id` | Bearer JWT | Detalha um produto por ID |
| `POST` | `/api/produtos` | Bearer JWT | Cadastra um novo produto |
| `PUT` | `/api/produtos/:id` | Bearer JWT | Atualiza um produto existente |
| `DELETE` | `/api/produtos/:id` | Bearer JWT | Remove um produto |

---

## Como Inicializar e Executar

### Pré-requisitos
- **Node.js** 22+ e **npm**

### 1. Instalar dependências (Frontend e Backend)
```bash
npm install
npm --prefix backend install
```

### 2. Iniciar o servidor Backend (Terminal 1 — porta `3000`)
```bash
npm run start:backend
```

### 3. Iniciar o servidor Frontend Angular (Terminal 2 — porta `4200`)

**Execução local:**
```bash
npm start
```

**Execução no GitHub Codespaces:**
```bash
npx ng serve --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.json
```

Acesse a aplicação pelo navegador na porta `4200` (localmente em `http://localhost:4200` ou pela URL encaminhada da porta `4200` na aba **Ports** do Codespace).

### Credenciais de Acesso (Login JWT)
- **E-mail:** `admin@optimus.com`
- **Senha:** `123456`

---

## Bateria de Testes e Validação

### Build de Produção e Testes Unitários
```bash
# Verifica compilação TypeScript, templates e bundle de produção
npx ng build

# Executa os testes unitários (Vitest)
npm test
```

### Teste da Proteção JWT na API (Terminal)
Com o backend rodando na porta `3000`, valide o bloqueio das rotas protegidas:

```bash
# Sem token -> esperado: HTTP/1.1 401 Unauthorized ("Token não informado.")
curl -i http://localhost:3000/api/produtos

# Com token inválido -> esperado: HTTP/1.1 401 Unauthorized ("Token inválido ou expirado.")
curl -i -H "Authorization: Bearer token-invalido" http://localhost:3000/api/produtos
```

### Roteiro de Testes Funcionais na Interface
1. **Route Guard:** Sem estar logado (ou após clicar em **Sair**), acesse `/produtos` ou `/produtos/novo` pela URL. *Esperado:* redirecionamento automático para `/login`.
2. **Signal Forms (Login):** Digite um e-mail inválido ou senha com menos de 6 caracteres. *Esperado:* exibição das mensagens de validação e botão de login desabilitado.
3. **Autenticação JWT:** Faça login com `admin@optimus.com` e `123456`. *Esperado:* resposta `200 OK`, token gravado, redirecionamento para `/produtos` e cabeçalho exibindo o usuário autenticado.
4. **HttpInterceptor:** No DevTools (`F12` → *Network*), inspecione a chamada `GET /api/produtos`. *Esperado:* cabeçalho `Authorization: Bearer <token>` enviado automaticamente.
5. **Comunicação com Signals:** Clique nos cards **Total de produtos**, **Disponíveis** e **Em falta**. *Esperado:* filtro instantâneo na tabela via `model()` e `computed()` sem recarregar a página.
6. **CRUD Completo + Signal Forms:**
   - **Incluir (`/produtos/novo`):** Teste a validação (nome com menos de 3 letras ou quantidade negativa) e depois salve um produto válido (`POST 201`).
   - **Detalhar (`/produtos/:id`):** Clique em **Detalhar** para visualizar todos os campos (`GET 200`).
   - **Alterar (`/produtos/:id/editar`):** Edite quantidade ou disponibilidade e salve (`PUT 200`).
   - **Remover:** Clique em **Excluir** e confirme a remoção (`DELETE 204`).
   - **Persistência na API:** Pressione `F5` na tela `/produtos` e confirme que os dados permanecem sincronizados com o backend.

---

## Autor
Desenvolvido por **João Victor (`@JVictorFD`)** — IFRN / TADS 2026.2.