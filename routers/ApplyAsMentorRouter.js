const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

const ApplyAsMentorController = require('../controllers/ApplyAsMentorController');

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: APIs for applying as a mentor
 */

/**
 * @swagger
 * /api/Application:
 *   post:
 *     summary: Apply as a mentor
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties of the request body if applicable
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/', isAuth, ApplyAsMentorController.ApplyAsMentor);

/**
 * @swagger
 * /api/Application/getAllApplications:
 *   get:
 *     summary: Get all mentorship applications
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mentorship applications retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getAllApplications', isAuth, ApplyAsMentorController.getAllApplications);

module.exports = router;
