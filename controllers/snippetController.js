//snippetController.js
const Snippet = require("../models/snippetModel");

// Get all snippets
exports.getAll = async (req, res) => {
  try {
    const rows = await Snippet.getAllSnippets();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
};

// Get snippet by ID
exports.getById = async (req, res) => {
  try {
    const snippet = await Snippet.getSnippetById(parseInt(req.params.id));
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
};

// Add snippet
exports.addSnippet = async (req, res) => {
  const { title, language, tags, content } = req.body;
  if (!title || !language || !content)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const id = await Snippet.addSnippet({ title, language, tags, content });
    res.status(201).json({ id, message: "Snippet added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add snippet" });
  }
};

// Update snippet
exports.updateSnippet = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, language, tags, content } = req.body;

  if (!title || !language || !content)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const changes = await Snippet.updateSnippet(id, { title, language, tags, content });
    if (changes === 0) return res.status(404).json({ error: "Snippet not found" });
    res.json({ message: "Snippet updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update snippet" });
  }
};

// Delete snippet
exports.deleteSnippet = async (req, res) => {
  try {
    const changes = await Snippet.deleteSnippet(parseInt(req.params.id));
    if (changes === 0) return res.status(404).json({ error: "Snippet not found" });
    res.json({ message: "Snippet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete snippet" });
  }
};