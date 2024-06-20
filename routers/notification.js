const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: APIs for managing notifications
 */

/**
 * @swagger
 * /api/notification/allNotification:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/allNotification', isAuth, notificationController.gitAllNotification);

/**
 * @swagger
 * /api/notification/notificationIsReaded/{notificationId}:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.put('/notificationIsReaded/:notificationId', isAuth, notificationController.notificationIsReaded);

/**
 * @swagger
 * /api/notification/deleteNotification/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.delete('/deleteNotification/:notificationId', isAuth, notificationController.deleteNotification);

module.exports = router;
