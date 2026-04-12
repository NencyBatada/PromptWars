const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize SQLite Database
const dbPath = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('sqlite://', '') : './finwise.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create a simple table for storing advisor history
        db.run(`CREATE TABLE IF NOT EXISTS advisor_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT,
            ai_response TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/glossary', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'glossary.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load glossary data' });
    }
});

app.get('/api/quiz', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'quiz.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load quiz data' });
    }
});

app.post('/api/advisor', async (req, res) => {
    const { message, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
            error: 'Gemini API key is missing. Please add it to your .env file.' 
        });
    }

    try {
        const prompt = `You are FinWise, a friendly and expert financial literacy assistant. 
        Context: The user is currently looking at ${context?.topic || 'general financial topics'}.
        User Question: "${message}"
        
        Provide a simple, expert response following these rules:
        1. Explain concepts simply.
        2. Be encouraging and non-judgmental.
        3. Avoid specific stock tips; focus on foundational principles (saving, budgeting, passive investing).
        4. Keep it under 150 words.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Save to SQLite history
        db.run(`INSERT INTO advisor_history (user_message, ai_response) VALUES (?, ?)`, 
            [message, responseText]);

        res.json({ response: responseText });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to get advice from AI' });
    }
});

// Endpoint to view history
app.get('/api/history', (req, res) => {
    db.all(`SELECT * FROM advisor_history ORDER BY timestamp DESC LIMIT 10`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
