const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Data Caching ---
// Read static JSON files once at startup for efficiency
let glossaryData = null;
let quizData = null;

try {
    glossaryData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'glossary.json'), 'utf8'));
    console.log(`Loaded ${glossaryData.length} glossary terms.`);
} catch (err) {
    console.error('Failed to pre-load glossary data:', err.message);
}

try {
    quizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quiz.json'), 'utf8'));
    console.log(`Loaded ${quizData.length} quiz questions.`);
} catch (err) {
    console.error('Failed to pre-load quiz data:', err.message);
}

// --- Database Initialization ---
const dbPath = path.resolve(__dirname, 'finwise.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS advisor_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// --- Initialize Gemini AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Security Middleware ---
app.use(helmet({
    contentSecurityPolicy: false, // CSP is handled in the HTML meta tag for the SPA
    crossOriginEmbedderPolicy: false,
}));

// CORS configuration — restrict origins in production
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.APP_URL || 'https://prompt-wars-936999660940.us-central1.run.app']
    : ['http://localhost:5173', 'http://localhost:5001', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now, log for monitoring
            console.warn(`CORS: Unexpected origin ${origin}`);
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Compression for all responses
app.use(compression());

// Body parser with size limits for security
app.use(express.json({ limit: '10kb' }));

// Rate limiting — protect AI endpoint from abuse
const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please wait a moment before asking again.' },
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// --- Health Check Endpoint (for Cloud Run) ---
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// --- API Routes ---

/**
 * GET /api/glossary
 * Returns cached financial glossary terms.
 */
app.get('/api/glossary', (_req, res) => {
    if (!glossaryData) {
        return res.status(500).json({ error: 'Glossary data is unavailable.' });
    }
    res.json(glossaryData);
});

/**
 * GET /api/quiz
 * Returns cached quiz questions.
 */
app.get('/api/quiz', (_req, res) => {
    if (!quizData) {
        return res.status(500).json({ error: 'Quiz data is unavailable.' });
    }
    res.json(quizData);
});

/**
 * POST /api/advisor
 * Sends a user message to the Gemini AI and returns the response.
 * Includes input validation, sanitization, and rate limiting.
 */
app.post('/api/advisor', aiLimiter, async (req, res) => {
    const { message, context } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    // Sanitize input: limit length, trim whitespace
    const sanitizedMessage = message.trim().slice(0, 500);

    if (sanitizedMessage.length === 0) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(503).json({
            error: 'AI advisor is not configured. Please set the GEMINI_API_KEY environment variable.'
        });
    }

    try {
        const topicContext = (context?.topic && typeof context.topic === 'string')
            ? context.topic.slice(0, 100)
            : 'general financial topics';

        const prompt = `You are FinWise, a friendly and expert financial literacy assistant. 
        Context: The user is currently looking at ${topicContext}.
        User Question: "${sanitizedMessage}"
        
        Provide a simple, expert response following these rules:
        1. Explain concepts simply.
        2. Be encouraging and non-judgmental.
        3. Avoid specific stock tips; focus on foundational principles (saving, budgeting, passive investing).
        4. Keep it under 150 words.`;

        const generateWithRetry = async (prompt, maxRetries = 3) => {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await model.generateContent(prompt);
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    console.warn(`Gemini API error, retrying in ${Math.round(delay)}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };

        const result = await generateWithRetry(prompt);
        const responseText = result.response.text();

        // Save to SQLite history using parameterized queries
        db.run(
            `INSERT INTO advisor_history (user_message, ai_response) VALUES (?, ?)`,
            [sanitizedMessage, responseText],
            (err) => {
                if (err) console.error('Failed to save advisor history:', err.message);
            }
        );

        res.json({ response: responseText });
    } catch (error) {
        console.error('Gemini API Error:', error.message || error);
        res.status(500).json({ error: 'Failed to get advice from AI. Please try again.' });
    }
});

/**
 * GET /api/history
 * Returns the 10 most recent advisor conversations.
 */
app.get('/api/history', (_req, res) => {
    db.all(
        `SELECT id, user_message, ai_response, timestamp FROM advisor_history ORDER BY timestamp DESC LIMIT 10`,
        [],
        (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Failed to retrieve history.' });
            }
            res.json(rows || []);
        }
    );
});

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, 'frontend/dist');
    app.use(express.static(staticPath, {
        maxAge: '1d', // Cache static assets for 1 day
        etag: true,
    }));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

// --- Graceful Shutdown ---
const server = app.listen(PORT, () => {
    console.log(`FinWise server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        db.close((err) => {
            if (err) console.error('Error closing database:', err.message);
            console.log('Database connection closed.');
            process.exit(0);
        });
    });
});

module.exports = app; // Export for testing
