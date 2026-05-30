const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'reveste.db');

let db;

async function getDB() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  // Insere usuários padrão se vazio
  const result = db.exec("SELECT COUNT(*) as total FROM usuarios");
  const total = result[0].values[0][0];
  if (total === 0) {
    db.run("INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      ['Administrador', 'admin@reveste.com', '123456', 'admin']);
    db.run("INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      ['Usuário Teste', 'teste@reveste.com', '123', 'user']);
  }

  saveDB();
  return db;
}

function saveDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDB, saveDB };
/*const mysql = require('mysql2/promise');

// configuracao do banco de dados
// host: onde o banco esta (localhost)
// user: usuario do mysql (no xampp o padrao e root)
// password: senha (no xampp o padrao e vazio)
// database: nome do banco que voce criou
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reveste_db',
  port: 3306, // porta padrao do mysql no xampp
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return pool;
  } catch (err) {
    console.log('Erro no banco: ' + err.message);
    return null;
  }
}

module.exports = { connectDB };*/
