const express = require("express");
const router = express.Router();
const taskController = require("@controllers/task.controller");

// GET all tasks (optionally filtered by case)
router.get("/", taskController.getAllTasks);

// GET task by ID
router.get("/:id", taskController.getTaskById);

// POST create new task
router.post("/", taskController.createTask);

// PUT update a task
router.put("/:id", taskController.updateTask);

// DELETE soft-delete a task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
