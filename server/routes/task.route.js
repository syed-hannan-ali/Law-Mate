const express = require("express");
const router = express.Router();
const taskController = require("@controllers/task.controller");
const verifyToken = require("@middleware/auth.middleware");
const { verify } = require("jsonwebtoken");

// GET all tasks (optionally filtered by case)
router.get("/", verifyToken,taskController.getAllTasks);

// GET task by ID
router.get("/:id", verifyToken,taskController.getTaskById);

// POST create new task
router.post("/",verifyToken ,taskController.createTask);

// PUT update a task
router.put("/:id",verifyToken ,taskController.updateTask);

// DELETE soft-delete a task
router.delete("/:id", verifyToken ,taskController.deleteTask);

module.exports = router;
