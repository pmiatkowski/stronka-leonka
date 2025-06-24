const express = require('express');
const router = express.Router();
const {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
} = require('../controllers/agentReportsController');

/**
 * @route GET /api/reports
 * @description Get all reports
 * @access Public
 */
router.get('/', getAllReports);

/**
 * @route GET /api/reports/:id
 * @description Get a report by ID
 * @access Public
 */
router.get('/:id', getReportById);

/**
 * @route POST /api/reports
 * @description Create a new report
 * @access Public
 */
router.post('/', createReport);

/**
 * @route PUT /api/reports/:id
 * @description Update a report
 * @access Public
 */
router.put('/:id', updateReport);

/**
 * @route DELETE /api/reports/:id
 * @description Delete a report
 * @access Public
 */
router.delete('/:id', deleteReport);

module.exports = router;