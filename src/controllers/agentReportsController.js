const pool = require('../db/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all reports from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the reports are fetched and sent as a JSON response.
 */
const getAllReports = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agent_reports ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get a single report by ID from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the report is fetched and sent as a JSON response.
 */
const getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM agent_reports WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new report in the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the report is created and sent as a JSON response.
 */
const createReport = async (req, res) => {
    const { identyfikator_agenta, raport, poziom_satysfakcji, access_code } = req.body;
    
    // Validation
    if (!identyfikator_agenta) {
        return res.status(400).json({ error: 'identyfikator_agenta is required' });
    }
    
    if (poziom_satysfakcji && (poziom_satysfakcji < 1 || poziom_satysfakcji > 5)) {
        return res.status(400).json({ error: 'poziom_satysfakcji must be between 1 and 5' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO agent_reports (id, identyfikator_agenta, raport, poziom_satysfakcji, access_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [uuidv4(), identyfikator_agenta, raport, poziom_satysfakcji, access_code]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update an existing report in the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the report is updated and sent as a JSON response.
 */
const updateReport = async (req, res) => {
    const { id } = req.params;
    const { identyfikator_agenta, raport, poziom_satysfakcji, access_code } = req.body;
    
    // Validation
    if (poziom_satysfakcji && (poziom_satysfakcji < 1 || poziom_satysfakcji > 5)) {
        return res.status(400).json({ error: 'poziom_satysfakcji must be between 1 and 5' });
    }

    try {
        const result = await pool.query(
            'UPDATE agent_reports SET identyfikator_agenta = COALESCE($1, identyfikator_agenta), raport = COALESCE($2, raport), poziom_satysfakcji = COALESCE($3, poziom_satysfakcji), access_code = COALESCE($4, access_code) WHERE id = $5 RETURNING *',
            [identyfikator_agenta, raport, poziom_satysfakcji, access_code, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a report from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the report is deleted and a 204 status is sent.
 */
const deleteReport = async (req, res) => {
    const { id } = req.params;
    const { access_code } = req.body;

    if (!access_code) {
        return res.status(400).json({ error: 'Access code is required' });
    }

    try {
        // First check if report exists and verify access code
        const checkResult = await pool.query(
            'SELECT * FROM agent_reports WHERE id = $1 AND access_code = $2',
            [id, access_code]
        );
        
        if (checkResult.rows.length === 0) {
            return res.status(403).json({ error: 'Invalid access code or report not found' });
        }
        
        // If access code is correct, proceed with deletion
        const result = await pool.query('DELETE FROM agent_reports WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
};