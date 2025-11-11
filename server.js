const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST a new task
app.post('/api/tasks', async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                { text: text.trim(), completed: false }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// PUT update a task
app.put('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { text, completed } = req.body;

    if (text !== undefined && text.trim() === '') {
        return res.status(400).json({ error: 'Task text cannot be empty' });
    }

    try {
        const updateData = {};
        if (text !== undefined) updateData.text = text.trim();
        if (completed !== undefined) updateData.completed = completed;

        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Task not found' });
            }
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    try {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
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
