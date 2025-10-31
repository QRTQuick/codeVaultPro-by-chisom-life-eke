const express = require("express");
const router = express.Router();
const controller = require("../controllers/snippetController");

router.get("/", controller.getAll);
router.post("/", controller.addSnippet);
router.delete("/:id", controller.deleteSnippet);

module.exports = router;