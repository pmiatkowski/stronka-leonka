const express = require('express');
const path = require('path');
const agentReportsRoutes = require('./routes/agentReports');
require('dotenv').config();

// Set environment to production
process.env.NODE_ENV = 'production';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// API Routes first
app.use('/api/reports', agentReportsRoutes);

// Then serve static files
app.use('/', express.static(path.join(__dirname, 'html')));

/**
 * Fallback route handler to serve the index.html file for unknown routes.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'index.html'));
});

/**
 * Error handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});