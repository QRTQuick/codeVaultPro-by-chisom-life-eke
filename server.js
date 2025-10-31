const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Routes for API
const snippetRoutes = require("./routes/snippets");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serves CSS, JS, images
app.set("views", path.join(__dirname, "views")); // optional if you use templating

// API routes
app.use("/api/snippets", snippetRoutes);

// Serve HTML pages
// Root shows user intro first
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "userintro.html"));
});

// User intro page route (optional direct access)
app.get("/userintro.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "userintro.html"));
});

// Main pages
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/add.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "add.html"));
});

app.get("/edit.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "edit.html"));
});

app.get("/view.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "view.html"));
});

// Optional: catch-all 404 page
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CodeVaultPro running at http://localhost:${PORT}`);
});