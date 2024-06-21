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
 *               track:
 *                 type: string
 *               languagePreference:
 *                 type: string
 *               genderPreference:
 *                 type: string
 *               type:
 *                 type: string
 *               Reason:
 *                 type: string
 *               description:
 *                 type: string
 *               minSalary:
 *                 type: number
 *               maxSalary:
 *                 type: number
 *               sessionDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
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
 *   post:
 *     summary: Get recommended mentors
 *     tags: [Mentor Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredLanguage:
 *                 type: string
 *               preferredGender:
 *                 type: string
 *               track:
 *                 type: string
 *               minSalary:
 *                 type: string
 *               maxSalary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a list of recommended mentors
 *       404:
 *         description: No mentors found
 */
router.post('/recommend-mentors', mentorRequestController.getMentorsRecommendation);

/**
 * @swagger
 * /api/request/{userId}/request:
 *   post:
 *     summary: Request a recommended mentor
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 * /api/request/{userId}/reject-request:
 *   post:
 *     summary: Reject a mentor request
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 * /api/request/{userId}/accept-request:
 *   post:
 *     summary: Accept a mentor request
 *     tags: [Mentor Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
