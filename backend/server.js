import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'chave-secreta-ifrn-app-ricas-2026';

app.use(cors());
app.use(express.json());

// Usuário fixo para demonstração do login JWT
const USUARIO_DEMO = {
  id: 1,
  nome: 'João Victor',
  email: 'admin@optimus.com',
  senha: '123456',
  perfil: 'Administrador',
};

// Dados iniciais em memória no backend
let produtos = [
  {
    id: 1001,
    nome: 'Teclado Mecânico Sem Fio',
    quantidade: 18,
    dataFabricacao: '2026-08-15',
    disponivel: true,
  },
  {
    id: 1002,
    nome: 'Monitor Ultrawide 29"',
    quantidade: 6,
    dataFabricacao: '2026-09-10',
    disponivel: true,
  },
  {
    id: 1003,
    nome: 'Webcam Full HD 1080p',
    quantidade: 0,
    dataFabricacao: '2026-07-22',
    disponivel: false,
  },
];

// Middleware de proteção JWT
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não informado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

// Rota pública: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== USUARIO_DEMO.email || password !== USUARIO_DEMO.senha) {
    return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
  }

  const token = jwt.sign(
    {
      sub: USUARIO_DEMO.id,
      nome: USUARIO_DEMO.nome,
      email: USUARIO_DEMO.email,
      perfil: USUARIO_DEMO.perfil,
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return res.json({
    token,
    usuario: {
      nome: USUARIO_DEMO.nome,
      email: USUARIO_DEMO.email,
      perfil: USUARIO_DEMO.perfil,
    },
  });
});

// Rotas protegidas de Produtos (CRUD)
app.get('/api/produtos', autenticarJWT, (_req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/:id', autenticarJWT, (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  return res.json(produto);
});

app.post('/api/produtos', autenticarJWT, (req, res) => {
  const { nome, quantidade, dataFabricacao, disponivel } = req.body;

  if (!nome || !dataFabricacao) {
    return res.status(400).json({ mensagem: 'Nome e data de fabricação são obrigatórios.' });
  }

  const novoProduto = {
    id: Date.now(),
    nome: String(nome).trim(),
    quantidade: Number(quantidade ?? 0),
    dataFabricacao: String(dataFabricacao),
    disponivel: Boolean(disponivel),
  };

  produtos.push(novoProduto);
  return res.status(201).json(novoProduto);
});

app.put('/api/produtos/:id', autenticarJWT, (req, res) => {
  const id = Number(req.params.id);
  const index = produtos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  const { nome, quantidade, dataFabricacao, disponivel } = req.body;

  produtos[index] = {
    id,
    nome: String(nome).trim(),
    quantidade: Number(quantidade ?? 0),
    dataFabricacao: String(dataFabricacao),
    disponivel: Boolean(disponivel),
  };

  return res.json(produtos[index]);
});

app.delete('/api/produtos/:id', autenticarJWT, (req, res) => {
  const id = Number(req.params.id);
  const existe = produtos.some((p) => p.id === id);

  if (!existe) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  produtos = produtos.filter((p) => p.id !== id);
  return res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Optimus Inventory rodando em http://localhost:${PORT}`);
});
