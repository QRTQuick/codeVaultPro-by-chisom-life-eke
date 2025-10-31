//snippetModel.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path
const dbPath = path.join(__dirname, "../database/snippets.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Database connection error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    language TEXT,
    tags TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ======== Model functions ========

// Get all snippets
exports.getAllSnippets = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM snippets ORDER BY created_at DESC", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Get snippet by ID
exports.getSnippetById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM snippets WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Add new snippet
exports.addSnippet = ({ title, language, tags, content }) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO snippets (title, language, tags, content) VALUES (?, ?, ?, ?)";
    db.run(query, [title, language, tags || "", content], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

// Update snippet
exports.updateSnippet = (id, { title, language, tags, content }) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE snippets SET title = ?, language = ?, tags = ?, content = ? WHERE id = ?";
    db.run(query, [title, language, tags || "", content, id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

// Delete snippet
exports.deleteSnippet = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM snippets WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};