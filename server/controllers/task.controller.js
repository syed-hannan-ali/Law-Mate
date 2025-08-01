const Task = require("@models/task.model.js");

// Get all tasks (with optional case ID filter)
exports.getAllTasks = async (req, res) => {
    try {
        const filter = { isDeleted: false };
        if (req.query.caseId) {
            filter.case = req.query.caseId;
        }

        const tasks = await Task.find(filter)
            .populate("assignedTo", "username email role")
            .populate("createdBy", "username email")
            .populate("case", "title description status");

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "username email role")
            .populate("createdBy", "username email")
            .populate("case", "title description status");

        if (!task || task.isDeleted)
            return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a task
exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated || updated.isDeleted)
            return res.status(404).json({ error: "Task not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.isDeleted)
            return res.status(404).json({ error: "Task not found" });

        task.isDeleted = true;
        await task.save();
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
