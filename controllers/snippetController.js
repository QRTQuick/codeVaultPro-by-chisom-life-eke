const Database = require("better-sqlite3");
const db = new Database("./database/snippets.db");

db.prepare(`CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    language TEXT,
    tags TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

exports.getAll = (req, res) => {
  const rows = db.prepare("SELECT * FROM snippets ORDER BY created_at DESC").all();
  res.json(rows);
};

exports.addSnippet = (req, res) => {
  const { title, language, tags, content } = req.body;
  const stmt = db.prepare("INSERT INTO snippets (title, language, tags, content) VALUES (?, ?, ?, ?)");
  stmt.run(title, language, tags, content);
  res.json({ message: "Snippet added successfully" });
};

exports.deleteSnippet = (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM snippets WHERE id = ?").run(id);
  res.json({ message: "Snippet deleted" });
};