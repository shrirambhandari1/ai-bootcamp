const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Helper function to read tasks from file
function readTasks() {
    try {
        if (!fs.existsSync(TASKS_FILE)) {
            fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
}

// Helper function to write tasks to file
function writeTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tasks:', error);
        return false;
    }
}

// GET all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    tasks.push(newTask);

    if (writeTasks(tasks)) {
        res.status(201).json(newTask);
    } else {
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { text, completed } = req.body;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (text !== undefined) {
        if (text.trim() === '') {
            return res.status(400).json({ error: 'Task text cannot be empty' });
        }
        tasks[taskIndex].text = text.trim();
    }

    if (completed !== undefined) {
        tasks[taskIndex].completed = completed;
    }

    if (writeTasks(tasks)) {
        res.json(tasks[taskIndex]);
    } else {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length === filteredTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (writeTasks(filteredTasks)) {
        res.json({ message: 'Task deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Root route - serve the todo list app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'todo-list.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/todo-list.html in your browser`);
});
