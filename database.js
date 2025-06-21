const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pi.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id TEXT,
    recipient TEXT,
    amount REAL,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
