const express = require('express');
const session = require('express-session');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables validation
const requiredEnvVars = ['OPENAI_API_KEY', 'CHAT_PASSWORD', 'SESSION_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://yourdomain.com'
        : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
    credentials: true,
}));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
    name: 'gpt4-chat-session', // Don't use default session name
}));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 chat requests per minute
    message: 'Too many chat requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Utility function for OpenAI API calls with retry logic
async function callOpenAI(messages, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const completion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
                messages: messages,
                max_tokens: parseInt(process.env.MAX_TOKENS) || 1000,
                temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            return completion.choices[0].message;
        } catch (error) {
            console.error(`OpenAI API attempt ${attempt} failed:`, error.message);
            
            // Handle specific error types
            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            } else if (error.status === 429) {
                // Rate limit exceeded, wait before retry
                const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
                console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else if (error.status >= 500) {
                // Server error, retry with exponential backoff
                if (attempt < maxRetries) {
                    const waitTime = 1000 * Math.pow(2, attempt);
                    console.log(`Server error. Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
            } else if (error.status === 400) {
                // Bad request, don't retry
                throw new Error(`Invalid request: ${error.message}`);
            }
            
            // If it's the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }
        }
    }
}

// Routes

// Login endpoint
app.post('/api/login', loginLimiter, (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        if (password === process.env.CHAT_PASSWORD) {
            req.session.authenticated = true;
            req.session.loginTime = new Date().toISOString();
            
            console.log(`Successful login from IP: ${req.ip} at ${req.session.loginTime}`);
            
            res.json({ 
                success: true, 
                message: 'Login successful',
                sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            });
        } else {
            console.log(`Failed login attempt from IP: ${req.ip}`);
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Chat endpoint
app.post('/api/chat', chatLimiter, requireAuth, async (req, res) => {
    try {
        const { message, conversation, history } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required and must be a string' });
        }
        
        if (message.length > 4000) {
            return res.status(400).json({ error: 'Message too long. Maximum 4000 characters.' });
        }
        
        // Build conversation history
        const messages = [];
        
        // System message
        messages.push({
            role: 'system',
            content: 'You are a helpful AI assistant. You can speak Korean fluently. Respond in the same language as the user\'s input. Provide clear, accurate, and helpful responses. When asked about well-known people like Sam Altman (CEO of OpenAI), provide accurate information.'
        });
        
        // Add conversation history (limit to last 20 messages to prevent token overflow)
        const conversationData = conversation || history;
        if (conversationData && Array.isArray(conversationData)) {
            const recentConversation = conversationData.slice(-20);
            for (const msg of recentConversation) {
                if (msg.role && msg.content && ['user', 'assistant'].includes(msg.role)) {
                    messages.push({
                        role: msg.role,
                        content: msg.content.substring(0, 2000) // Limit individual message length
                    });
                }
            }
        }
        
        // Add current message
        messages.push({
            role: 'user',
            content: message
        });
        
        // Call OpenAI API with retry logic
        const response = await callOpenAI(messages);
        
        console.log(`Chat request processed for session at ${new Date().toISOString()}`);
        
        res.json({
            response: response.content,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        
        // Send appropriate error message based on error type
        if (error.message.includes('Invalid OpenAI API key')) {
            res.status(503).json({ error: 'Service configuration error' });
        } else if (error.message.includes('Rate limit')) {
            res.status(429).json({ error: 'Service temporarily unavailable. Please try again in a moment.' });
        } else if (error.message.includes('Invalid request')) {
            res.status(400).json({ error: 'Invalid request format' });
        } else {
            res.status(500).json({ error: 'Failed to process your request. Please try again.' });
        }
    }
});

// Logout endpoint
app.post('/api/logout', requireAuth, (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).json({ error: 'Failed to logout' });
            }
            
            res.clearCookie('gpt4-chat-session');
            console.log(`User logged out from IP: ${req.ip} at ${new Date().toISOString()}`);
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check authentication endpoint
app.get('/api/check-auth', (req, res) => {
    try {
        if (req.session.authenticated) {
            res.json({ 
                authenticated: true,
                loginTime: req.session.loginTime,
                sessionExpiry: new Date(req.session.cookie.expires).toISOString()
            });
        } else {
            res.json({ authenticated: false });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve the main app for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Shutting down gracefully...');
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`GPT-4 Chat Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Session timeout: 24 hours`);
    console.log('Required environment variables loaded successfully');
});

module.exports = app;