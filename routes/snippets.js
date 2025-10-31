//snippets.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/snippetController");

// GET all snippets
router.get("/", controller.getAll);

// GET snippet by ID
router.get("/:id", controller.getById);

// POST new snippet
router.post("/", controller.addSnippet);

// PUT update snippet
router.put("/:id", controller.updateSnippet);

// DELETE snippet
router.delete("/:id", controller.deleteSnippet);

module.exports = router;