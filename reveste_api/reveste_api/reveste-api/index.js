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
/*const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;
const USERS_FILE = path.join(__dirname, 'users.json');

const readUsersJSON = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) return [];
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) { return []; }
};

const saveUsersJSON = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Rotas da API
app.post('/signup', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const db = await connectDB();
        if (db) {
            // tenta salvar no mysql
            const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (rows.length > 0) return res.status(400).json({ success: false, message: "Email ja existe" });
            await db.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
            console.log("Salvo no MySQL com sucesso!");
            return res.status(201).json({ success: true, message: "Cadastrado no banco" });
        }
    } catch (err) { 
        console.log("MySQL falhou, tentando salvar no arquivo JSON..."); 
    }

    // se o mysql falhar, salva no json
    const usuarios = readUsersJSON();
    if (usuarios.find(u => u.email === email)) return res.status(400).json({ success: false, message: "Email ja existe" });
    usuarios.push({ id: Date.now(), nome, email, senha });
    saveUsersJSON(usuarios);
    res.status(201).json({ success: true, message: "Cadastrado no JSON" });
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const db = await connectDB();
        if (db) {
            const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
            if (rows.length > 0) return res.status(200).json({ success: true, user: rows[0] });
        }
    } catch (err) { console.log("Erro banco, tentando JSON..."); }
    const u = readUsersJSON().find(u => u.email === email && u.senha === senha);
    if (u) return res.status(200).json({ success: true, user: u });
    res.status(401).json({ success: false, message: "Senha errada" });
});

app.use(express.static(path.join(__dirname, '../reveste-web')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../reveste-web/html/login.html'));
});

app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, '../reveste-web/html', `${page}.html`));
});

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:" + port);
});
*/