const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const agentReportsRoutes = require('./routes/agentReports');
require('dotenv').config();

// Set environment to production
process.env.NODE_ENV = 'production';

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Initialize admin table on server start
async function initializeAdminTable() {
    try {
        // Verify admin password is set
        if (!process.env.ADMIN_PASSWORD) {
            throw new Error('ADMIN_PASSWORD environment variable is not set');
        }

        // Create table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_settings (
                id SERIAL PRIMARY KEY,
                setting_name VARCHAR(50) UNIQUE NOT NULL,
                setting_value TEXT NOT NULL
            )
        `);

        // First, try to update existing password
        const updateResult = await pool.query(
            'UPDATE admin_settings SET setting_value = $1 WHERE setting_name = $2 RETURNING *',
            [process.env.ADMIN_PASSWORD.trim(), 'admin_password']
        );

        // If no row was updated, insert new password
        if (updateResult.rowCount === 0) {
            await pool.query(
                'INSERT INTO admin_settings (setting_name, setting_value) VALUES ($1, $2)',
                ['admin_password', process.env.ADMIN_PASSWORD.trim()]
            );
            console.log('Admin password initialized successfully');
        } else {
            console.log('Admin password updated successfully');
        }

        // Verify password was set correctly
        const verifyResult = await pool.query(
            'SELECT setting_value FROM admin_settings WHERE setting_name = $1',
            ['admin_password']
        );

        if (verifyResult.rows.length === 0) {
            throw new Error('Failed to initialize admin password');
        }

        console.log('Admin settings verified successfully');
        return true;
    } catch (error) {
        console.error('Error initializing admin settings:', error);
        throw error; // Re-throw to handle in startup
    }
}

// Middleware
app.use(express.json());

// Admin authentication middleware
async function authenticateAdmin(req, res, next) {
    const { adminPassword } = req.body;
    
    if (!adminPassword) {
        return res.status(403).json({ error: 'Admin password is required' });
    }

    try {
        const result = await pool.query(
            'SELECT setting_value FROM admin_settings WHERE setting_name = $1',
            ['admin_password']
        );

        if (result.rows.length === 0) {
            console.error('Admin password not found in database');
            return res.status(500).json({ error: 'Admin settings not initialized' });
        }

        const storedPassword = result.rows[0].setting_value;
        const providedPassword = adminPassword.trim();

        if (storedPassword !== providedPassword) {
            console.log('Invalid admin password attempt');
            return res.status(403).json({ error: 'Invalid admin password' });
        }

        next();
    } catch (error) {
        console.error('Error authenticating admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Add admin delete endpoint
app.delete('/api/reports/:id/admin', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM agent_reports WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

// Start server only after database is initialized
async function startServer() {
    try {
        await initializeAdminTable();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();