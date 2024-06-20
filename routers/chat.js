const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const isAuth = require("../middlewares/isAuth");
const upload = require('../middlewares/uploadFile');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: APIs for managing chats and messages
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
router.post('/', isAuth, upload.array('files'), chatController.sendMessage);

/**
 * @swagger
 * /api/chat/getChats:
 *   get:
 *     summary: Get user's chats
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's chats retrieved successfully
 */
router.get('/getChats', isAuth, chatController.getUserChats);

/**
 * @swagger
 * /api/chat/findChat/{chatId}:
 *   get:
 *     summary: Find a chat by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat to find
 *     responses:
 *       200:
 *         description: Chat found successfully
 *       404:
 *         description: Chat not found
 */
router.get('/findChat/:chatId', isAuth, chatController.findChat);

/**
 * @swagger
 * /api/chat/editMessage/{messageId}:
 *   put:
 *     summary: Update a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to update
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 */
router.put('/editMessage/:messageId', isAuth, chatController.updateMessage);

/**
 * @swagger
 * /api/chat/markMesageAsReaded/{messageId}:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to mark as read
 *     responses:
 *       200:
 *         description: Message marked as read successfully
 *       404:
 *         description: Message not found
 */
router.put('/markMesageAsReaded/:messageId', isAuth, chatController.markMesageAsReaded);

/**
 * @swagger
 * /api/chat/deleteMessage/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete('/deleteMessage/:messageId', isAuth, chatController.deleteMessage);

module.exports = router;
