const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/uploadFile');
const sessionController = require('../controllers/SessionController');

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: APIs for managing sessions between mentors and mentees
 */

/**
 * @swagger
 * /api/session/{reqId}:
 *   post:
 *     summary: Create a session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reqId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the request associated with the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             // Define schema for request body if applicable
 *     responses:
 *       200:
 *         description: Session created successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:reqId', isAuth, sessionController.createSession);

/**
 * @swagger
 * /api/session/{sessionId}:
 *   put:
 *     summary: Confirm a session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to confirm
 *     responses:
 *       200:
 *         description: Session confirmed successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.put('/:sessionId', isAuth, sessionController.confirmSession);

/**
 * @swagger
 * /api/session/uploadMatrial/{sessionId}:
 *   post:
 *     summary: Upload material for a session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to upload material for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Material uploaded successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/uploadMatrial/:sessionId', isAuth, upload.array('Attachment'), sessionController.addMatrial);

/**
 * @swagger
 * /api/session/getMentorSessions:
 *   get:
 *     summary: Get sessions for a mentor
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getMentorSessions', isAuth, sessionController.getMentorSessions);

/**
 * @swagger
 * /api/session/getMenteeSessions:
 *   get:
 *     summary: Get sessions for a mentee
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getMenteeSessions', isAuth, sessionController.getMenteeSessions);

/**
 * @swagger
 * /api/session/getSession/{sessionId}:
 *   get:
 *     summary: Get session details
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to retrieve details for
 *     responses:
 *       200:
 *         description: Session details retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getSession/:sessionId', isAuth, sessionController.getSession);

module.exports = router;
