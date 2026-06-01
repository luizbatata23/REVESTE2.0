const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDB, saveDB } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

app.post('/signup', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const db = await getDB();
    const existe = db.exec("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existe.length > 0) return res.status(400).json({ success: false, message: "Email já existe" });

    db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha]);
    saveDB();
    return res.status(201).json({ success: true, message: "Cadastrado com sucesso" });
  } catch (err) {
    console.log("Erro:", err.message);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const db = await getDB();
    const result = db.exec("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha]);
    if (result.length > 0) {
      const cols = result[0].columns;
      const vals = result[0].values[0];
      const user = Object.fromEntries(cols.map((c, i) => [c, vals[i]]));
      return res.status(200).json({ success: true, user });
    }
    return res.status(401).json({ success: false, message: "Email ou senha incorretos" });
  } catch (err) {
    console.log("Erro:", err.message);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.use(express.static(path.join(__dirname, '../reveste-web')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../reveste-web/html/login.html'));
});

app.get('/:page.html', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, '../reveste-web/html', `${page}.html`));
});

app.listen(port, async () => {
  await getDB(); // inicializa o banco ao subir o servidor
  console.log("Servidor rodando em http://localhost:" + port);
});

app.post('/vendedor', async (req, res) => {
  const { nome, cpf, loja, telefone, email } = req.body;
  if (!nome || !cpf || !loja || !email) {
    return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios" });
  }
  try {
    const db = await getDB();
    const existe = db.exec("SELECT * FROM vendedores WHERE cpf = ? OR email = ?", [cpf, email]);
    if (existe.length > 0) return res.status(400).json({ success: false, message: "CPF ou email já cadastrado" });

    db.run("INSERT INTO vendedores (nome, cpf, loja, telefone, email) VALUES (?, ?, ?, ?, ?)",
      [nome, cpf, loja, telefone, email]);
    saveDB();
    return res.status(201).json({ success: true, message: "Vendedor cadastrado com sucesso!" });
  } catch (err) {
    console.log("Erro:", err.message);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.get('/vendedores', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec("SELECT * FROM vendedores");
    if (result.length === 0) return res.json([]);
    const cols = result[0].columns;
    const vendedores = result[0].values.map(v => Object.fromEntries(cols.map((c, i) => [c, v[i]])));
    return res.json(vendedores);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDB();
    db.run("DELETE FROM usuarios WHERE id = ?", [id]);
    saveDB();
    return res.json({ success: true, message: "Usuário removido" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.delete('/vendedor/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDB();
    db.run("DELETE FROM vendedores WHERE id = ?", [id]);
    saveDB();
    return res.json({ success: true, message: "Vendedor removido" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
});