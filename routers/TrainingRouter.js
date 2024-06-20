const express = require('express');
const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');
const isMentor = require('../middlewares/isMentor');
const upload = require('../middlewares/uploadFile');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trainings
 *   description: APIs for managing trainings
 */

/**
 * @swagger
 * /api/training:
 *   get:
 *     summary: Get all trainings for the current user
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved user's trainings successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/', isAuth, TrainingController.getUserAllTrainings);

/**
 * @swagger
 * /api/training/{trainingId}:
 *   get:
 *     summary: Get details of a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to fetch
 *     responses:
 *       200:
 *         description: Retrieved training details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Training'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Training not found
 */
router.get('/:trainingId', isAuth, TrainingController.getTrainingById);

/**
 * @swagger
 * /api/training/mentor:
 *   get:
 *     summary: Get all trainings for the current mentor
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved mentor's trainings successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 */
router.get('/mentor', isAuth, isMentor, TrainingController.getMentorTrainings);

/**
 * @swagger
 * /api/training/enroll/{trainingId}:
 *   put:
 *     summary: Enroll in a training
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to enroll in
 *     responses:
 *       200:
 *         description: Successfully enrolled in the training
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.put('/enroll/:trainingId', isAuth, TrainingController.enrollInTraining);

/**
 * @swagger
 * /api/training/create-training:
 *   post:
 *     summary: Create a new training
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Training'
 *     responses:
 *       200:
 *         description: Training created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 */
router.post('/create-training', isAuth, isMentor, TrainingController.createTraining);

/**
 * @swagger
 * /api/training/{id}:
 *   put:
 *     summary: Update a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Training'
 *     responses:
 *       200:
 *         description: Training updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 *       404:
 *         description: Training not found
 */
router.put('/:id', isAuth, isMentor, TrainingController.updateTraining);

/**
 * @swagger
 * /api/training/{id}:
 *   delete:
 *     summary: Delete a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to delete
 *     responses:
 *       200:
 *         description: Training deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 *       404:
 *         description: Training not found
 */
router.delete('/:id', isAuth, isMentor, TrainingController.deleteTraining);

/**
 * @swagger
 * /api/training/{id}/startTraining:
 *   put:
 *     summary: Start a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to start
 *     responses:
 *       200:
 *         description: Training started successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 *       404:
 *         description: Training not found
 */
router.put('/:id/startTraining', isAuth, isMentor, TrainingController.startTraining);

/**
 * @swagger
 * /api/training/{id}/endTraining:
 *   put:
 *     summary: End a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to end
 *     responses:
 *       200:
 *         description: Training ended successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 *       404:
 *         description: Training not found
 */
router.put('/:id/endTraining', isAuth, isMentor, TrainingController.endTraining);

/**
 * @swagger
 * /api/training/addSession:
 *   post:
 *     summary: Add a session to a training
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: Session added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
 */
router.post('/addSession', isAuth, isMentor, TrainingController.addSession);

/**
 * @swagger
 * /api/training/getSessions/{trainingId}:
 *   get:
 *     summary: Get all sessions of a training by ID
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training to fetch sessions for
 *     responses:
 *       200:
 *         description: Retrieved training sessions successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Training not found
 */
router.get('/getSessions/:trainingId', isAuth, TrainingController.getSessions);
/** 
 * @swagger
 * /api/training/addAnnouncement:
 *   post:
 *     summary: Add an announcement to a training
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Announcement added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Current user is not a mentor
*/
router.post('/addAnnouncement', isAuth, isMentor, TrainingController.addAnnouncement);

/**
* @swagger
* /api/training/getAnnouncements/{trainingId}:
*   get:
*     summary: Get all announcements of a training by ID
*     tags: [Trainings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: trainingId
*         schema:
*           type: string
*         required: true
*         description: ID of the training to fetch announcements for
*     responses:
*       200:
*         description: Retrieved training announcements successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Announcement'
*       401:
*         description: Unauthorized - Missing or invalid token
*       404:
*         description: Training not found
*/
router.get('/getAnnouncements/:trainingId', isAuth, TrainingController.getAnnouncements);

/**
* @swagger
* /api/training/deleteAnnouncement/{announcementId}:
*   delete:
*     summary: Delete an announcement by ID
*     tags: [Trainings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: announcementId
*         schema:
*           type: string
*         required: true
*         description: ID of the announcement to delete
*     responses:
*       200:
*         description: Announcement deleted successfully
*       401:
*         description: Unauthorized - Missing or invalid token
*       403:
*         description: Forbidden - Current user is not a mentor
*       404:
*         description: Announcement not found
*/
router.delete('/deleteAnnouncement/:announcementId', isAuth, isMentor, TrainingController.deleteAnnouncement);

/**
* @swagger
* /api/training/editAnnouncement/{announcementId}:
*   put:
*     summary: Edit an announcement by ID
*     tags: [Trainings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: announcementId
*         schema:
*           type: string
*         required: true
*         description: ID of the announcement to edit
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*               content:
*                 type: string
*             required:
*               - title
*               - content
*     responses:
*       200:
*         description: Announcement edited successfully
*       400:
*         description: Bad request - Invalid input data
*       401:
*         description: Unauthorized - Missing or invalid token
*       403:
*         description: Forbidden - Current user is not a mentor
*       404:
*         description: Announcement not found
*/
router.put('/editAnnouncement/:announcementId', isAuth, isMentor, TrainingController.editAnnouncement);

/**
* @swagger
* /api/training/sendMessage/{trainingId}:
*   post:
*     summary: Send a message to a training
*     tags: [Trainings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: trainingId
*         schema:
*           type: string
*         required: true
*         description: ID of the training to send a message to
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*               files:
*                 type: array
*                 items:
*                   type: string
*             required:
*               - message
*     responses:
*       200:
*         description: Message sent successfully
*       400:
*         description: Bad request - Invalid input data
*       401:
*         description: Unauthorized - Missing or invalid token
*       404:
*         description: Training not found
*/
router.post('/sendMessage/:trainingId', isAuth, upload.array('files'), TrainingController.sendMessage);

/**
* @swagger
* /api/training/getMessages/{trainingId}:
*   get:
*     summary: Get all messages of a training by ID
*     tags: [Trainings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: trainingId
*         schema:
*           type: string
*         required: true
*         description: ID of the training to fetch messages for
*     responses:
*       200:
*         description: Retrieved training messages successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Message'
*       401:
*         description: Unauthorized - Missing or invalid token
*       404:
*         description: Training not found
*/
router.get('/getMessages/:trainingId', isAuth, TrainingController.getMessages);

module.exports = router;