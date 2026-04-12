const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

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

app.post('/api/advisor', (req, res) => {
    const { message, context } = req.body;
    // This is a placeholder for real Gemini API integration
    // In a real app, you would use @google/generative-ai here
    res.json({
        response: `As your FinWise Advisor, I see you're interested in ${context?.topic || 'finance'}. Based on your query: "${message}", my advice is to prioritize your emergency fund while leveraging compound interest for long-term growth.`
    });
});


// Serve frontend in production (optional for now, but good practice)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
