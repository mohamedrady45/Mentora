const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/MentorRequestController');
const isAuth = require('../middlewares/isAuth');

/**
 * @swagger
 * tags:
 *   name: Mentor Requests
 *   description: APIs for managing mentor requests and recommendations
 */

/**
 * @swagger
 * /api/request/mentor-request:
 *   post:
 *     summary: Create a new mentor request
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Specify the properties expected in the request body
 *     responses:
 *       200:
 *         description: Mentor request created successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/mentor-request', isAuth, mentorRequestController.createMentorRequest);

/**
 * @swagger
 * /api/request/recommend-mentors:
 *   get:
 *     summary: Get recommended mentors
 *     tags: [Mentor Requests]
 *     responses:
 *       200:
 *         description: Returns a list of recommended mentors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mentor'
 *       404:
 *         description: No mentors found
 */
router.get('/recommend-mentors', mentorRequestController.getMentorsRecommendation);

/**
 * @swagger
 * /api/request/{id}/request:
 *   post:
 *     summary: Request a recommended mentor
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the recommended mentor
 *     responses:
 *       200:
 *         description: Request sent successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:id/request', isAuth, mentorRequestController.RequestRecommendedMentor);

/**
 * @swagger
 * /api/request/{id}/reject-request:
 *   post:
 *     summary: Reject a mentor request
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the mentor request to reject
 *     responses:
 *       200:
 *         description: Mentor request rejected successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:id/reject-request', isAuth, mentorRequestController.MentorRejectRequest);

/**
 * @swagger
 * /api/request/{id}/accept-request:
 *   post:
 *     summary: Accept a mentor request
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the mentor request to accept
 *     responses:
 *       200:
 *         description: Mentor request accepted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:id/accept-request', isAuth, mentorRequestController.MentorAcceptedRequest);

module.exports = router;
