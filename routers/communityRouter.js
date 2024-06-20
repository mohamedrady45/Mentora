const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController'); 
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/uploadFile'); // If needed for file uploads

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: APIs for managing communities, questions, and membership
 */

/**
 * @swagger
 * /api/community/createNewCommunity:
 *   post:
 *     summary: Create a new community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Community
 *               description:
 *                 type: string
 *                 example: This is a community for discussing various topics.
 *     responses:
 *       200:
 *         description: Community created successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/createNewCommunity', isAuth, communityController.createCommunity);

/**
 * @swagger
 * /api/community/getAllCommunities:
 *   get:
 *     summary: Get all communities a user is a member of
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Community'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getAllCommunities', isAuth, communityController.getUserCommunities);

/**
 * @swagger
 * /api/community/searchCommunity:
 *   get:
 *     summary: Search for communities by name
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Community name or part of the name to search for
 *     responses:
 *       200:
 *         description: Returns communities matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Community'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/searchCommunity', isAuth, communityController.searchCommunity);

/**
 * @swagger
 * /api/community/{communityId}:
 *   get:
 *     summary: Get details of a specific community
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community to fetch
 *     responses:
 *       200:
 *         description: Returns the community details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Community'
 *       404:
 *         description: Community not found
 */
router.get('/:communityId', communityController.getCommunity);

/**
 * @swagger
 * /api/community/{communityId}/getCommunityQuestions:
 *   get:
 *     summary: Get questions in a specific community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community to fetch questions from
 *     responses:
 *       200:
 *         description: Returns questions in the community
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Community not found
 */
router.get('/:communityId/getCommunityQuestions', isAuth, communityController.getCommunityQuestions);

/**
 * @swagger
 * /api/community/{communityId}/questions/{questionId}:
 *   get:
 *     summary: Get details of a specific question in a community
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community containing the question
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to fetch
 *     responses:
 *       200:
 *         description: Returns the question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Community or question not found
 */
router.get('/:communityId/questions/:questionId', communityController.getOneCommunityQuestion);

/**
 * @swagger
 * /api/community/{communityId}/join:
 *   post:
 *     summary: Join a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community to join
 *     responses:
 *       200:
 *         description: Successfully joined the community
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:communityId/join', isAuth, communityController.joinCommunity);

/**
 * @swagger
 * /api/community/{communityId}/leave:
 *   post:
 *     summary: Leave a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community to leave
 *     responses:
 *       200:
 *         description: Successfully left the community
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:communityId/leave', isAuth, communityController.leaveCommunity);

/**
 * @swagger
 * /api/community/{communityId}/addQuestion:
 *   post:
 *     summary: Add a question to a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community to add the question to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: How to use APIs?
 *               body:
 *                 type: string
 *                 example: I'm trying to understand how to integrate APIs into my application.
 *     responses:
 *       200:
 *         description: Question added successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:communityId/addQuestion', isAuth, communityController.addQuestion);

/**
 * @swagger
 * /api/community/{communityId}/questions/{questionId}/answerQuestion:
 *   post:
 *     summary: Answer a question in a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community containing the question
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *                 example: You can integrate APIs using libraries like Axios or Fetch.
 *     responses:
 *       200:
 *         description: Answer added successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/:communityId/questions/:questionId/answerQuestion', isAuth, communityController.answerQuestion);
/**
 * @swagger
 * /api/community/{communityId}/questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       404:
 *         description: Posts not found
 */
router.get('/:communityId/questions/:questionId/answers',isAuth ,  communityController.getQuestionAnswers);

module.exports = router;
