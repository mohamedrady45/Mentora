const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');
const isAuth = require("../middlewares/isAuth");

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: APIs for managing tests
 */

/**
 * @swagger
 * /api/test:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: Test created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/', isAuth, testController.addTest);

/**
 * @swagger
 * /api/test/{trainingId}:
 *   get:
 *     summary: Get details of a test by training ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training associated with the test
 *     responses:
 *       200:
 *         description: Retrieved test details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Test not found
 */
router.get('/:trainingId', isAuth, testController.getTest);

/**
 * @swagger
 * /api/test/submit:
 *   post:
 *     summary: Submit a test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestSubmission'
 *     responses:
 *       200:
 *         description: Test submitted successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/submit', isAuth, testController.submitTest);

module.exports = router;
